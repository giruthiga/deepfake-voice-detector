# backend/train_model.py
import os
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from transformers import Wav2Vec2Processor, Wav2Vec2Model
from sklearn.metrics import accuracy_score
import soundfile as sf
import numpy as np
import librosa

# Configuration
AUDIO_DIR = "data"  # You'll create this folder
BATCH_SIZE = 32
EPOCHS = 2
LEARNING_RATE = 5e-5
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
SAMPLE_RATE = 16000
MAX_DURATION = 4.0

class DeepfakeDataset(Dataset):
    def __init__(self, processor, dir_path):
        self.processor = processor
        self.file_paths = []
        self.labels = []
        
        # Load real audio (label 0)
        real_dir = os.path.join(dir_path, "real")
        if os.path.exists(real_dir):
            for f in os.listdir(real_dir):
                if f.endswith('.wav') or f.endswith('.mp3'):
                    self.file_paths.append(os.path.join(real_dir, f))
                    self.labels.append(0)
        
        # Load fake audio (label 1)
        fake_dir = os.path.join(dir_path, "fake")
        if os.path.exists(fake_dir):
            for f in os.listdir(fake_dir):
                if f.endswith('.wav') or f.endswith('.mp3'):
                    self.file_paths.append(os.path.join(fake_dir, f))
                    self.labels.append(1)

    def __len__(self):
        return len(self.file_paths)

    def __getitem__(self, idx):
        audio_path = self.file_paths[idx]
        label = self.labels[idx]
        try:
            # Load and resample to 16kHz
            audio, sr = sf.read(audio_path, dtype="float32")
            
            # Resample if needed
            if sr != SAMPLE_RATE:
                audio = librosa.resample(audio, orig_sr=sr, target_sr=SAMPLE_RATE)
            
            # Ensure it's mono
            if len(audio.shape) > 1:
                audio = audio[:, 0]
            
            # Truncate or pad to max_duration
            max_samples = int(SAMPLE_RATE * MAX_DURATION)
            if len(audio) > max_samples:
                audio = audio[:max_samples]
            else:
                padding = max_samples - len(audio)
                audio = np.pad(audio, (0, padding), mode="constant")
            
            # Process for wav2vec2
            inputs = self.processor(audio, sampling_rate=SAMPLE_RATE, return_tensors="pt", padding=True)
            return {"input_values": inputs.input_values[0], "label": torch.tensor(label)}
        except Exception as e:
            # Return a dummy example on error
            print(f"Error loading {audio_path}: {e}")
            return {"input_values": torch.zeros(1, SAMPLE_RATE * MAX_DURATION), "label": torch.tensor(0)}

class AudioClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.wav2vec2 = Wav2Vec2Model.from_pretrained("facebook/wav2vec2-base")
        self.classifier = nn.Sequential(
            nn.Linear(768, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 2)
        )
        
    def forward(self, x):
        outputs = self.wav2vec2(x)
        x = outputs.last_hidden_state.mean(dim=1)
        return self.classifier(x)

def train_model():
    processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base")
    model = AudioClassifier().to(DEVICE)
    
    dataset = DeepfakeDataset(processor, AUDIO_DIR)
    dataloader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)
    
    optimizer = torch.optim.AdamW(model.parameters(), lr=LEARNING_RATE)
    criterion = nn.CrossEntropyLoss()
    
    print(f"Starting training on {DEVICE}...")
    print(f"Dataset size: {len(dataset)} files")
    
    for epoch in range(EPOCHS):
        model.train()
        total_loss = 0
        all_preds = []
        all_labels = []
        
        for batch in dataloader:
            optimizer.zero_grad()
            inputs = batch["input_values"].to(DEVICE)
            labels = batch["label"].to(DEVICE)
            
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
            all_preds.extend(torch.argmax(outputs, dim=1).cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
        
        epoch_acc = accuracy_score(all_labels, all_preds)
        print(f"Epoch {epoch+1}/{EPOCHS}: Loss={total_loss/len(dataloader):.4f}, Accuracy={epoch_acc*100:.2f}%")
    
    # Save the trained model
    os.makedirs("models", exist_ok=True)
    torch.save(model.state_dict(), "models/deepfake_detector.pth")
    print("✅ Model saved to models/deepfake_detector.pth")

if __name__ == "__main__":
    train_model()