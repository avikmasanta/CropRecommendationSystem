from flask import Flask, request, jsonify, abort, send_file, send_from_directory
from flask_cors import CORS
import os
import joblib
import numpy as np
import traceback
from dotenv import load_dotenv
import google.generativeai as genai
from gtts import gTTS
from io import BytesIO

load_dotenv()

APP = Flask(__name__, static_folder='frontend_dist', static_url_path='')
CORS(APP)
MODELS = {}
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')

FEATURE_NAMES = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    print("Warning: GOOGLE_API_KEY not set. Put it in a .env file or in the environment.")
else:
    genai.configure(api_key=GOOGLE_API_KEY)

try:
    gemini_model = genai.GenerativeModel('models/gemini-2.5-flash')
except Exception:
    gemini_model = None


def load_models():
    global MODELS
    MODELS = {}
    if not os.path.exists(MODELS_DIR):
        os.makedirs(MODELS_DIR)
    for fname in os.listdir(MODELS_DIR):
        if fname.endswith('.pkl'):
            path = os.path.join(MODELS_DIR, fname)
            try:
                model = joblib.load(path)
                MODELS[fname] = model
                print(f"Loaded model: {fname}")
            except Exception as e:
                print(f"Failed to load {fname}: {e}")


@APP.route('/', defaults={'path': ''})
@APP.route('/<path:path>')
def index(path):
    # Serve API routes handled by other decorators first;
    # this catch-all only fires for unmatched paths.
    if path and (APP.static_folder is not None):
        full = os.path.join(APP.static_folder, path)
        if os.path.isfile(full):
            return send_from_directory(APP.static_folder, path)
    return send_from_directory(APP.static_folder, 'index.html')


@APP.route('/explain', methods=['POST'])
def explain():
    data = request.json
    features = data.get('features')
    prediction = data.get('prediction')
    language = data.get('language', 'English')

    prompt = f"""
    Act as an agricultural expert. 
    A machine learning model predicted '{prediction}' (probability: High) 
    is the best crop for these soil conditions: {features}.
    
    Explain in 3 simple bullet points why '{prediction}' is suitable here.
    
    IMPORTANT: Provide the response strictly in {language} language.
    """

    try:
        if gemini_model is None:
            return jsonify({"explanation": "Gemini model not configured"}), 500
        response = gemini_model.generate_content(prompt)
        return jsonify({"explanation": response.text})
    except Exception as e:
        return jsonify({"explanation": f"AI Error: {str(e)}\n"}), 500


@APP.route('/api/crop-guide', methods=['POST'])
def crop_guide():
    data = request.json
    crop = data.get('crop')
    language = data.get('language', 'English')

    if not crop:
        return jsonify({"error": "No crop specified"}), 400

    prompt = f"""
    Act as a professional agronomist. Provide a comprehensive, step-by-step guide on how to grow '{crop}'.
    
    The response must be in JSON format with exactly these keys:
    1. 'steps': A list of 5-7 clear steps for cultivation (from land preparation to harvest).
    2. 'fertilizers': A string describing recommended fertilizers and their timing.
    3. 'diseases': A list of 2-3 common diseases, each with:
       - 'name': Disease name.
       - 'symptoms': Brief description of symptoms.
       - 'treatment': How to manage it.
       - 'image_desc': A vivid word description for an AI image generator to visualize this specific disease (for UI accessibility).

    IMPORTANT: 
    - Provide the content strictly in {language} language.
    - Return ONLY valid JSON.
    """

    try:
        if gemini_model is None:
            return jsonify({"error": "Gemini model not configured"}), 500
        
        response = gemini_model.generate_content(prompt)
        # Clean response text in case AI adds markdown blocks
        clean_json = response.text.strip()
        print(f"DEBUG: AI Response for {crop}: {clean_json[:200]}...") # Log first 200 chars
        
        if clean_json.startswith('```json'):
            clean_json = clean_json[7:-3].strip()
        elif clean_json.startswith('```'):
            clean_json = clean_json[3:-3].strip()
            
        # Validate JSON before returning
        import json
        try:
            json.loads(clean_json)
        except Exception as je:
            print(f"DEBUG: JSON Parse Error: {je}")
            # Try to fix common issues or just return error
            return jsonify({"error": "AI returned invalid JSON format. Please try again."}), 502

        return clean_json, 200, {'Content-Type': 'application/json'}
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"AI Error: {str(e)}"}), 500


@APP.route('/tts', methods=['POST'])
def text_to_speech():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON data received"}), 400

        text = data.get('text')
        lang_name = data.get('language', 'English')

        if not text or not text.strip():
            return jsonify({"error": "No text provided to speak"}), 400

        lang_map = {
            'English': 'en', 'Hindi': 'hi', 'Urdu': 'ur', 'Spanish': 'es',
            'French': 'fr', 'Bengali': 'bn', 'Marathi': 'mr', 'Tamil': 'ta', 'Telugu': 'te'
        }
        lang_code = lang_map.get(lang_name, 'en')

        tts = gTTS(text=text, lang=lang_code, slow=False)
        audio_io = BytesIO()
        tts.write_to_fp(audio_io)
        audio_io.seek(0)
        return send_file(audio_io, mimetype='audio/mpeg')

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@APP.route('/models')
def models_list():
    return jsonify({'models': sorted(MODELS.keys())})


def parse_features_from_dict(d):
    vals = []
    for f in FEATURE_NAMES:
        if f not in d:
            raise KeyError(f"Missing feature: {f}")
        vals.append(float(d[f]))
    arr = np.array(vals).reshape(1, -1)
    if np.all(arr == 0):
        raise ValueError("All features are zero; please provide valid inputs for prediction")
    return arr


@APP.route('/api/predict', methods=['POST'])
def api_predict():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'Invalid JSON body'}), 400

    model_name = data.get('model')
    features = data.get('features')
    if not model_name or not features:
        return jsonify({'error': 'Provide "model" and "features" in JSON'}), 400

    if model_name not in MODELS:
        return jsonify({'error': f'Model {model_name} not found'}), 404

    model = MODELS[model_name]
    try:
        X = parse_features_from_dict(features)
        pred = model.predict(X)
        proba = None
        if hasattr(model, 'predict_proba'):
            proba = model.predict_proba(X).tolist()
        result = {
            'model': model_name,
            'prediction': pred.tolist(),
            'probabilities': proba
        }
        return jsonify(result)
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@APP.route('/predict', methods=['POST'])
def predict():
    data = request.form.to_dict()
    try:
        features = parse_features_from_dict(data)
    except KeyError as e:
        return jsonify({'error': str(e)}), 400
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

    selected_model_name = data.get('model')
    if not selected_model_name:
        return jsonify({'error': 'No model selected'}), 400
    model_path = os.path.join(MODELS_DIR, selected_model_name)
    if not os.path.exists(model_path):
        return jsonify({'error': f'Model {selected_model_name} not found'}), 404

    try:
        ml_model = joblib.load(model_path)
        probs = ml_model.predict_proba(features)[0]
        class_names = ml_model.classes_
        sorted_probs = sorted(zip(class_names, probs), key=lambda x: x[1], reverse=True)
        top_5 = []
        for crop, score in sorted_probs[:5]:
            top_5.append({
                "crop": crop,
                "probability": round(score * 100, 2)
            })
        return jsonify({
            "top_prediction": top_5[0]['crop'],
            "all_predictions": top_5
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@APP.route('/api/market-prices', methods=['GET'])
def get_market_prices():
    import random
    import math
    import time
    import requests
    
    mandi_api_key = os.environ.get('MANDI_API_KEY')
    
    # Optional Real Mandi API Integration
    if mandi_api_key:
        try:
            url = f"https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key={mandi_api_key}&format=json&limit=500"
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                records = response.json().get('records', [])
                if records:
                    unique_commodities = {}
                    for r in records:
                        comm = r['commodity'].title()
                        if comm not in unique_commodities:
                            unique_commodities[comm] = r
                            
                    data = []
                    idx = 1
                    for comm, r in list(unique_commodities.items())[:22]: # Take the first 22 unique crops
                        try:
                            price_per_kg = float(r['modal_price']) / 100 # Mandi prices are INR/Quintal
                        except (ValueError, TypeError):
                            price_per_kg = 50.0
                            
                        data.append({
                            'id': idx,
                            'name': comm,
                            'symbol': comm[:3].upper(),
                            'price': round(price_per_kg, 2),
                            'change': round((random.random() * 2) - 1, 2), # Minor simulated standard change
                            'trend': 'stable',
                            'state': r.get('state', 'Unknown')
                        })
                        idx += 1
                    return jsonify(data)
        except Exception as e:
            print(f"Mandi API Data failure, falling back to simulation: {e}")
            pass

    # Base real-world-ish prices for Indian commodities (INR/kg approx)
    base_prices = {
        'Rice': 42.50, 'Wheat': 38.20, 'Maize': 25.15, 'Cotton': 85.00,
        'Jute': 62.40, 'Apple': 120.00, 'Mango': 95.00, 'Banana': 15.50,
        'Grapes': 150.00, 'Coffee': 240.00, 'Coconut': 45.00, 'Papaya': 20.00,
        'Orange': 40.00, 'Pomegranate': 80.00, 'Watermelon': 12.00, 'Lentil': 75.00,
        'Blackgram': 85.00, 'Mungbean': 90.00, 'Mothbeans': 60.00, 'Pigeonpeas': 80.00,
        'Kidneybeans': 120.00, 'Chickpea': 65.00
    }
    
    # Use current time to simulate "live" data that updates dynamically every 30 seconds
    time_window = int(time.time() / 30)
    random.seed(time_window)
    
    data = []
    idx = 1
    for name, base in base_prices.items():
        # Procedural fluctuation: +/- 4% based on time window
        fluctuation_percent = (random.random() - 0.5) * 8
        current_price = base * (1 + fluctuation_percent / 100)
        
        # 24h change simulated logic
        change = (random.random() * 6) - 3 # between -3% and +3%
        if change > 1.2: trend = 'up'
        elif change < -1.2: trend = 'down'
        else: trend = 'stable'
        
        data.append({
            'id': idx,
            'name': name,
            'symbol': name[:3].upper(),
            'price': round(current_price, 2),
            'change': round(change, 2),
            'trend': trend
        })
        idx += 1
        
    return jsonify(data)

if __name__ == '__main__':
    load_models()
    APP.run(host='0.0.0.0', port=5000, debug=True)
