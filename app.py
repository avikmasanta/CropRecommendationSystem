<<<<<<< HEAD
from flask import Flask, request, jsonify, abort, send_file, send_from_directory
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
MODELS = {}
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')

FEATURE_NAMES = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    print("Warning: GOOGLE_API_KEY not set. Put it in a .env file or in the environment.")
else:
    genai.configure(api_key=GOOGLE_API_KEY)

try:
    gemini_model = genai.GenerativeModel('gemini-2.5-flash')
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
        import os
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
        return jsonify({"explanation": f"AI Error: {str(e)}"}), 500


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


if __name__ == '__main__':
    load_models()
    APP.run(host='0.0.0.0', port=5000, debug=True)
=======
from flask import Flask, render_template, request, jsonify, abort
import os
import joblib
import numpy as np
import traceback


APP = Flask(__name__)
MODELS = {}
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')


FEATURE_NAMES = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']




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




@APP.route('/')
def index():
    return render_template('index.html', models=sorted(MODELS.keys()), features=FEATURE_NAMES)




@APP.route('/models')
def models_list():
    return jsonify({'models': sorted(MODELS.keys())})




def parse_features_from_dict(d):
    vals = []
    for f in FEATURE_NAMES:
        if f not in d:
            raise KeyError(f"Missing feature: {f}")
        vals.append(float(d[f]))
    return np.array(vals).reshape(1, -1)




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
def form_predict():
    form = request.form
    model_name = form.get('model')
    if not model_name:
        return jsonify({'error': 'No model selected'}), 400
    if model_name not in MODELS:
        return jsonify({'error': f'Model {model_name} not found'}), 404


    try:
        features = {f: form.get(f) for f in FEATURE_NAMES}
        X = parse_features_from_dict(features)
        model = MODELS[model_name]
        pred = model.predict(X)
        proba = model.predict_proba(X).tolist() if hasattr(model, 'predict_proba') else None
        return jsonify({'model': model_name, 'prediction': pred.tolist(), 'probabilities': proba})
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500




if __name__ == '__main__':
    load_models()
    APP.run(host='0.0.0.0', port=5000, debug=True)
>>>>>>> 5c6b25b5e54e24bfc3de8d473a48f3b8e3ba47b2
