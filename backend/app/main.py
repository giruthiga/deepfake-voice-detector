from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import tempfile
import numpy as np
import librosa
import soundfile as sf
from typing import Optional

app = FastAPI(title="VoiceGuard AI API", version="5.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "https://your-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# LOAD AUDIO & FEATURES
# -------------------------------
def load_audio(audio_path: str, sample_rate: int = 16000, max_duration: float = 4.0):
    audio, sr = sf.read(audio_path, dtype="float32")
    if sr != sample_rate:
        audio = librosa.resample(audio, orig_sr=sr, target_sr=sample_rate)
    if len(audio.shape) > 1:
        audio = audio[:, 0]
    max_samples = int(sample_rate * max_duration)
    if len(audio) > max_samples:
        audio = audio[:max_samples]
    else:
        padding = max_samples - len(audio)
        audio = np.pad(audio, (0, padding), mode="constant")
    return audio


def extract_features(audio_path: str):
    """
    Extract features and calculate a BALANCED deepfake score
    """
    y, sr = librosa.load(audio_path, sr=22050)
    
    # MFCCs
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
    mfccs_std = np.std(mfccs, axis=1)
    
    # Spectral features
    spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
    spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)[0]
    
    # Zero-crossing rate
    zcr = librosa.feature.zero_crossing_rate(y)[0]
    
    # RMS energy
    rms = librosa.feature.rms(y=y)[0]
    
    # Pitch
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    
    # Calculate features
    spectral_centroid_val = float(np.mean(spectral_centroids))
    spectral_bandwidth_val = float(np.mean(spectral_bandwidth))
    zcr_val = float(np.mean(zcr))
    rms_val = float(np.mean(rms))
    mfcc_std_val = float(np.mean(mfccs_std))
    pitch_val = float(np.mean(pitches[pitches > 0])) if np.any(pitches > 0) else 0.0
    
    # ===== Balanced Fake Score (0-100) =====
    fake_score = 50.0

    # 1. Spectral Centroid (humans: 1000-3500 Hz typically)
    if 1000 <= spectral_centroid_val <= 3500:
        fake_score -= 8
    elif spectral_centroid_val > 4500 or spectral_centroid_val < 500:
        fake_score += 12

    # 2. Spectral Bandwidth (humans: 1200-3000 Hz)
    if 1200 <= spectral_bandwidth_val <= 3000:
        fake_score -= 8
    elif spectral_bandwidth_val < 800 or spectral_bandwidth_val > 4000:
        fake_score += 12

    # 3. Zero Crossing Rate (humans: 0.02-0.15 for speech)
    if 0.02 <= zcr_val <= 0.15:
        fake_score -= 8
    elif zcr_val < 0.005 or zcr_val > 0.3:
        fake_score += 12

    # 4. Pitch (humans: 85-255 Hz for speech)
    if 85 <= pitch_val <= 255:
        fake_score -= 10
    elif pitch_val < 60 or pitch_val > 400:
        fake_score += 12

    # 5. MFCC Variance (humans: 15-45 typical)
    if 15 <= mfcc_std_val <= 45:
        fake_score -= 8
    elif mfcc_std_val < 8 or mfcc_std_val > 80:
        fake_score += 12

    # 6. RMS Energy (humans: 0.01-0.3 typical speech)
    if 0.01 <= rms_val <= 0.3:
        fake_score -= 8
    elif rms_val < 0.001 or rms_val > 0.7:
        fake_score += 10

    fake_score = max(0, min(100, fake_score))
    
    features = {
        "duration": round(len(y) / sr, 2),
        "mfcc_std": mfccs_std.tolist(),
        "spectral_centroid_mean": round(spectral_centroid_val, 2),
        "spectral_bandwidth_mean": round(spectral_bandwidth_val, 2),
        "zero_crossing_rate_mean": round(zcr_val, 4),
        "rms_mean": round(rms_val, 4),
        "pitch_mean": round(pitch_val, 2),
        
        "normalized_features": {
            "spectral_centroid": min(100, round((spectral_centroid_val / 5000) * 100, 2)),
            "zero_crossing_rate": min(100, round((zcr_val * 100), 2)),
            "mfcc": min(100, round((mfcc_std_val / 50) * 100, 2)),
            "pitch": min(100, round((pitch_val / 300) * 100, 2)),
        },
        
        "fake_score": fake_score
    }
    
    return features


# -------------------------------
# DETECTION LOGIC (BALANCED)
# -------------------------------
def detect_deepfake(features, threshold: float = 70.0):
    fake_prob = features.get("fake_score", 50)
    
    if fake_prob >= threshold:
        verdict = "FAKE"
    elif fake_prob >= 55:
        verdict = "SUSPICIOUS"
    else:
        verdict = "REAL"
    
    return {
        "verdict": verdict,
        "confidence": round(fake_prob, 2),
        "deepfake_score": round(fake_prob, 2),
        "model_used": "heuristic_v4"
    }


# -------------------------------
# API ENDPOINTS
# -------------------------------
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "VoiceGuard AI API", "version": "5.0.0"}


@app.post("/analyze")
async def analyze_audio(
    file: UploadFile = File(None),
    file_url: Optional[str] = None,
    threshold: float = 70.0
):
    try:
        if file is not None:
            audio_bytes = await file.read()
            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
                temp_audio.write(audio_bytes)
                temp_audio_path = temp_audio.name
        elif file_url:
            raise HTTPException(status_code=400, detail="URL analysis coming soon.")
        else:
            raise HTTPException(status_code=400, detail="No audio file provided")

        features = extract_features(temp_audio_path)
        detection_result = detect_deepfake(features, threshold)
        
        result = {
            "verdict": detection_result["verdict"],
            "confidence": detection_result["confidence"],
            "deepfake_score": detection_result["deepfake_score"],
            "duration": features["duration"],
            "features": features,
            "threshold": threshold,
            "model_used": detection_result["model_used"]
        }
        
        os.unlink(temp_audio_path)
        return JSONResponse(result)
        
    except Exception as e:
        if 'temp_audio_path' in locals() and os.path.exists(temp_audio_path):
            os.unlink(temp_audio_path)
        raise HTTPException(status_code=500, detail=str(e))