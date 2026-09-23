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
BATCH_SIZE = 32
EPOCHS = 2
LEARNING_RATE = 5e-5
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
SAMPLE_RATE = 16000
MAX_DURATION = 4.0

# Use only 500 files for fast testing
class DeepfakeDataset(Dataset):
    def __init__(self, processor, dir_path, max_files=500):
        self.processor = processor
        self.file_paths = []
        self.labels = []
        
        real_dir = os.path.join(dir_path, "real")
        fake_dir = os.path.join(dir_path, "fake")
        
        # Limit to max_files for each
        real_files = [os.path.join(real_dir, f) for f in os.listdir(real_dir) if f.endswith('.wav')][:max_files]
        fake_files = [os.path.join(fake_dir, f) for f in os.listdir(fake_dir) if f.endswith('.wav')][:max_files]
        
        self.file_paths = real_files + fake_files
        self.labels = [0] * len(real_files) + [1] * len(fake_files)

    def __len__(self):
        return len(self.file_paths)

    def __getitem__(self, idx):
        audio_path = self.file_paths[idx]
        label = self.labels[idx]
        try:
            audio, sr = sf.read(audio_path, dtype="float32")
            if sr != SAMPLE_RATE:
                audio = librosa.resample(audio, orig_sr=sr, target_sr=SAMPLE_RATE)
            if len(audio.shape) > 1:
                audio = audio[:, 0]
            max_samples = int(SAMPLE_RATE * MAX_DURATION)
            if len(audio) > max_samples:
                audio = audio[:max_samples]
            else:
                padding = max_samples - len(audio)
                audio = np.pad(audio, (0, padding), mode="constant")
            
            inputs = self.processor(audio, sampling_rate=SAMPLE_RATE, return_tensors="pt", padding=True)
            return {"input_values": inputs.input_values[0], "label": torch.tensor(label)}
        except Exception as e:
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
    
    dataset = DeepfakeDataset(processor, "data", max_files=500)
    dataloader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)
    
    optimizer = torch.optim.AdamW(model.parameters(), lr=LEARNING_RATE)
    criterion = nn.CrossEntropyLoss()
    
    print(f"Training on {len(dataset)} files (500 real + 500 fake)...")
    
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
    
    # Save the model
    os.makedirs("models", exist_ok=True)
    torch.save(model.state_dict(), "models/deepfake_detector.pth")
    print("✅ Model saved to models/deepfake_detector.pth")

if __name__ == "__main__":
    train_model()