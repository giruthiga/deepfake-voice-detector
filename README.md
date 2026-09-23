# VoiceGuard — DeepFake Voice Detector

An AI-powered web application that detects whether an audio recording is authentic human speech or AI-generated (deepfake). Built with a FastAPI backend and a Next.js frontend, DeepGuard provides fast, explainable voice authenticity analysis through a modern web interface.

![Status](https://img.shields.io/badge/status-active-success)
![Python](https://img.shields.io/badge/python-3.12-blue)
![Next.js](https://img.shields.io/badge/next.js-16-black)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Overview

Voice synthesis technology has advanced to the point where AI-generated audio is nearly indistinguishable from real human speech. This poses serious risks in fraud, misinformation, and identity theft. DeepGuard addresses this problem by analyzing audio recordings and classifying them as authentic or synthetic based on their acoustic properties.

The system extracts a broad set of signal-level features from an input audio file — including Mel-frequency cepstral coefficients (MFCCs), spectral centroid, zero-crossing rate, pitch statistics, and root mean square energy — and evaluates them against statistical models of natural human voice characteristics. The result is a verdict (REAL, SUSPICIOUS, or FAKE) accompanied by a confidence score and a detailed feature-level breakdown.

## Features

- Upload or record audio in WAV, MP3, FLAC, and M4A formats
- AI-based detection with confidence scoring
- Detailed acoustic feature analysis (MFCC, spectral, pitch, energy)
- User authentication and account management
- Analysis history for registered users
- Modern, responsive dark-themed interface
- RESTful API for external integrations
- Real-time feedback and progress indicators

## Tech Stack

### Backend

- FastAPI — REST API framework
- Uvicorn — ASGI server
- Librosa — Audio signal processing and feature extraction
- PyTorch — Deep learning (model training pipeline)
- NumPy — Numerical computation
- SoundFile — Audio file I/O
- SQLAlchemy — ORM and database management

### Frontend

- Next.js 16 — React framework with App Router
- TypeScript — Type-safe development
- Tailwind CSS — Utility-first styling
- Supabase — Authentication and file storage
- Lucide React — Icon library
- Framer Motion — Animations

## Architecture
Next.js Frontend (Port 3000) <--HTTP--> FastAPI Backend (Port 8000)
| |
v v
Supabase Auth & Storage Audio Processing + ML Inference

text

## Project Structure
deepfake-voice-detector/
|
├── backend/
│ ├── app/
│ │ ├── main.py # FastAPI application entry point
│ │ ├── routers/ # API route handlers
│ │ ├── services/ # Business logic
│ │ └── utils/ # Utilities
│ ├── ml/
│ │ ├── feature_extraction.py # Audio feature extraction
│ │ ├── model.py # PyTorch model definition
│ │ └── train_model.py # Training script
│ ├── models/ # Saved model weights (gitignored)
│ ├── data/ # Dataset directory (gitignored)
│ ├── uploads/ # Temporary upload storage
│ └── requirements.txt
│
├── frontend/
│ ├── app/
│ │ ├── page.tsx # Landing page
│ │ ├── analyze/ # Audio analysis page
│ │ ├── dashboard/ # User dashboard
│ │ ├── history/ # Analysis history
│ │ ├── profile/ # User profile
│ │ ├── login/ # Login page
│ │ ├── register/ # Registration page
│ │ └── settings/ # Account settings
│ ├── components/ # Reusable UI components
│ ├── context/ # React context providers
│ ├── lib/ # API clients and utilities
│ ├── public/ # Static assets
│ └── package.json
│
├── .gitignore
├── LICENSE
└── README.md

text

## Getting Started

### Prerequisites

- Python 3.12 or higher
- Node.js 18 or higher
- npm or yarn
- Git

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
The backend will be available at http://localhost:8000. Interactive API documentation is available at http://localhost:8000/docs.

Frontend Setup
bash
cd frontend
npm install
npm run dev
The frontend will be available at http://localhost:3000.

Environment Variables
Backend — .env (in backend/ directory)
text
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./deepfake.db
ALLOWED_ORIGINS=http://localhost:3000
Frontend — .env.local (in frontend/ directory)
text
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
API Reference
Health Check
text
GET /health
Returns the current status of the API service.

Response:

json
{
  "status": "healthy",
  "service": "VoiceGuard AI API",
  "version": "5.0.0"
}
Analyze Audio
text
POST /analyze
Content-Type: multipart/form-data
Analyzes an uploaded audio file and returns a detection verdict.

Parameters:

Name	Type	Required	Description
file	file	Yes	Audio file to analyze
threshold	float	No	Custom detection threshold (default: 70.0)
Example request:

bash
curl -X POST http://localhost:8000/analyze \
  -F "file=@sample.wav" \
  -F "threshold=70.0"
Example response:

json
{
  "verdict": "REAL",
  "confidence": 23.5,
  "deepfake_score": 23.5,
  "duration": 3.2,
  "features": {
    "spectral_centroid_mean": 2100.45,
    "spectral_bandwidth_mean": 1876.32,
    "zero_crossing_rate_mean": 0.087,
    "mfcc_std": 24.1,
    "pitch_mean": 145.6,
    "rms_mean": 0.043
  },
  "threshold": 70.0,
  "model_used": "heuristic_v4"
}
How It Works
DeepGuard performs voice authenticity detection through the following pipeline:

Audio Ingestion — The uploaded file is decoded, resampled to 22,050 Hz, and normalized.

Feature Extraction — The following acoustic features are computed using librosa:

Mel-frequency cepstral coefficients (MFCCs) — capture timbre

Spectral centroid and bandwidth — measure tonal brightness

Zero-crossing rate — detects noisiness and speech activity

Pitch (fundamental frequency) — captures prosody

RMS energy — measures signal loudness

MFCC variance — assesses naturalness of variation

Statistical Analysis — Each feature is compared against distributions observed in natural human speech. Features falling within expected human ranges reduce the deepfake score; anomalous values increase it.

Classification — A weighted score between 0 and 100 is produced. Based on the configured threshold, the audio is classified as:

REAL — Score below 55

SUSPICIOUS — Score between 55 and 70

FAKE — Score at or above 70

Explainability — The response includes per-feature values so users can understand which characteristics influenced the decision.

Roadmap
☑ Basic detection pipeline
☑ Feature extraction and analysis
☑ User authentication
☑ Analysis history
□ Trained deep learning model integration
□ Segment-level artifact localization
□ PDF report export
□ Batch file processing
□ Public API with rate limiting
□ Docker deployment
□ Continuous model retraining pipeline
Contributing
Contributions are welcome. To contribute:

Fork the repository

Create a feature branch (git checkout -b feature/your-feature)

Commit your changes (git commit -m "Add your feature")

Push to the branch (git push origin feature/your-feature)

Open a Pull Request

Please open an issue first for major changes to discuss the proposed modification.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Author
Giruthiga

GitHub: https://github.com/giruthiga

Email: giruthi97@gmail.com