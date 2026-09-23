import torch
import torch.nn as nn

class DeepFakeDetector(nn.Module):
    """
    CNN-based deepfake voice detector.
    Takes MFCC features as input and outputs real/fake prediction.
    """
    
    def __init__(self, input_dim=40, num_classes=2):
        super().__init__()
        
        self.conv_layers = nn.Sequential(
            nn.Conv1d(input_dim, 64, kernel_size=3, padding=1),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.MaxPool1d(2),
            
            nn.Conv1d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.MaxPool1d(2),
            
            nn.Conv1d(128, 256, kernel_size=3, padding=1),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.MaxPool1d(2),
        )
        
        self.fc_layers = nn.Sequential(
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, num_classes)
        )
    
    def forward(self, x):
        # x shape: [batch, input_dim, seq_len]
        x = self.conv_layers(x)
        
        # Global average pooling
        x = x.mean(dim=2)
        
        x = self.fc_layers(x)
        return x