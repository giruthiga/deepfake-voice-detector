import librosa
import numpy as np
import torch

def extract_features(audio_path, sample_rate=16000, n_mfcc=40, max_len=300):
    """
    Extract MFCC features from an audio file for the model.
    
    Args:
        audio_path: Path to audio file
        sample_rate: Target sample rate
        n_mfcc: Number of MFCC coefficients
        max_len: Maximum time steps (pad/truncate)
    
    Returns:
        Torch tensor of shape [1, n_mfcc, max_len]
    """
    # Load audio
    y, sr = librosa.load(audio_path, sr=sample_rate, duration=30)
    
    # Extract MFCC
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
    
    # Pad or truncate to max_len
    if mfcc.shape[1] < max_len:
        pad_width = max_len - mfcc.shape[1]
        mfcc = np.pad(mfcc, ((0, 0), (0, pad_width)), mode="constant")
    else:
        mfcc = mfcc[:, :max_len]
    
    # Convert to tensor and add batch dimension
    tensor = torch.tensor(mfcc, dtype=torch.float32).unsqueeze(0)
    
    return tensor