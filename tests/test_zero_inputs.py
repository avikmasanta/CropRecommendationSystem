import os
import joblib
import numpy as np
import traceback

BASE = os.path.dirname(__file__)
MODELS_DIR = os.path.join(BASE, '..', 'models')
MODELS_DIR = os.path.abspath(MODELS_DIR)

print('Models dir:', MODELS_DIR)
if not os.path.exists(MODELS_DIR):
    print('No models directory found at', MODELS_DIR)
    raise SystemExit(1)

model_files = [f for f in os.listdir(MODELS_DIR) if f.endswith('.pkl')]
if not model_files:
    print('No .pkl models found in', MODELS_DIR)

X = np.zeros((1, 7), dtype=float)
print('Test input (zeros):', X.tolist())

for fname in model_files:
    path = os.path.join(MODELS_DIR, fname)
    print('\n---')
    print('Model file:', fname)
    try:
        m = joblib.load(path)
        print('Loaded model type:', type(m))
        try:
            pred = m.predict(X)
            print(' predict ->', pred.tolist())
        except Exception as e:
            print(' predict error:', e)
            traceback.print_exc()
        if hasattr(m, 'predict_proba'):
            try:
                proba = m.predict_proba(X)
                print(' predict_proba ->', proba.tolist())
            except Exception as e:
                print(' predict_proba error:', e)
                traceback.print_exc()
        print(' classes_ ->', getattr(m, 'classes_', None))
    except Exception as e:
        print('load error for', fname, ':', e)
        traceback.print_exc()
