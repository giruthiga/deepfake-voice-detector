# backend/generate_test_data.py
import numpy as np
import soundfile as sf
import os

# Create folders if they don't exist
os.makedirs("data/real", exist_ok=True)
os.makedirs("data/fake", exist_ok=True)

# Generate 100 real audio files (sine waves - simulating real voices)
print("Generating 100 real audio files...")
for i in range(100):
    # Generate a 2-second sine wave
    sr = 16000
    duration = 2.0
    t = np.linspace(0, duration, int(sr * duration))
    # Different frequency for each file
    freq = 200 + (i * 10) % 800
    audio = 0.5 * np.sin(2 * np.pi * freq * t)
    sf.write(f"data/real/real_{i}.wav", audio, sr)

# Generate 100 fake audio files (different frequencies - simulating deepfakes)
print("Generating 100 fake audio files...")
for i in range(100):
    # Generate a 2-second noise + sine wave
    sr = 16000
    duration = 2.0
    t = np.linspace(0, duration, int(sr * duration))
    # Different frequency + noise for each file
    freq = 300 + (i * 15) % 1000
    audio = 0.3 * np.sin(2 * np.pi * freq * t) + 0.2 * np.random.normal(0, 1, len(t))
    sf.write(f"data/fake/fake_{i}.wav", audio, sr)

print("✅ Test data created!")
print(f"Real files: {len(os.listdir('data/real'))}")
print(f"Fake files: {len(os.listdir('data/fake'))}")