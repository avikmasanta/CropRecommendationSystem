import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

print(f"Using API Key: {api_key[:10]}...")

try:
    models = list(genai.list_models())
    for m in models:
        print(f"FOUND: {m.name}")
except Exception as e:
    print(f"ERROR: {e}")
