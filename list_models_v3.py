import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

with open('available_models.txt', 'w') as f:
    try:
        models = list(genai.list_models())
        for m in models:
            f.write(f"{m.name}\n")
        print("Done writing to available_models.txt")
    except Exception as e:
        f.write(f"ERROR: {e}\n")
        print(f"Error: {e}")
 