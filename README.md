# Crop Recommendation System

A modern web application that uses machine learning to recommend the best crops for specific soil and environmental conditions. It features an AI-powered explanation system using Google Gemini and text-to-speech functionality.

## Features

- **Crop Prediction**: Uses machine learning models (Random Forest, etc.) to predict the best crop based on Nitrogen (N), Phosphorus (P), Potassium (K), Temperature, Humidity, pH, and Rainfall.
- **AI Insights**: Provides detailed explanations for why a specific crop is recommended using Google Gemini.
- **Multilingual Support**: Supports multiple languages for both text and voice.
- **Interactive UI**: A sleek, responsive dashboard built with React and Tailwind CSS.

## Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: React, Vite, Tailwind CSS, Lucide React
- **ML/AI**: Scikit-learn, joblib, Google Generative AI (Gemini), gTTS
- **Language Support**: Multiple regional and international languages.

## Prerequisites

- **Python**: 3.8 or higher
- **Node.js**: 16.x or higher
- **npm**: 7.x or higher

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/avikmasanta/CropRecommendationSystem
cd CropRecommendationSystem
```

### 2. Backend Setup
Create a virtual environment and install the required Python packages.

```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup
Install the required Node.js packages for the frontend.

```bash
cd frontend
npm install
cd ..
```

### 4. Environment Variables
Create a `.env` file in the project root and add your Google Gemini API key.

```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

## Running the Application

### Development Mode
To run the project in development mode (with hot-reloading for the frontend):

1. **Start the Flask Backend**:
   ```bash
   python app.py
   ```
   *The backend will run on `http://127.0.0.1:5000`.*

2. **Start the Frontend Dev Server**:
   In a new terminal:
   ```bash
   cd frontend
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`. The Vite proxy will forward API requests to the Python backend automatically.*

### Production Mode (Built Frontend)
To test the application as it would be served by Flask:

1. **Build the Frontend**:
   ```bash
   cd frontend
   npm run build
   cd ..
   ```
   *This will generate the built files in the `frontend_dist` folder.*

2. **Run the Backend**:
   ```bash
   python app.py
   ```
   *Now, navigating to `http://127.0.0.1:5000` will serve the fully built frontend.*

## Project Structure

- `app.py`: Main Flask application handling API routes and serving the frontend.
- `models/`: Directory containing pre-trained machine learning models (`.pkl`).
- `frontend/`: Source code for the React frontend.
- `frontend_dist/`: Production build of the frontend (served by Flask).
- `requirements.txt`: Python package dependencies.

## License
MIT License
