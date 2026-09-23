import pandas as pd
import shutil
import os

# Read the metadata CSV
df = pd.read_csv(r"C:\Users\girut\Downloads\dataset_IT\metadata\metadata_IT.csv", sep=' ', header=None)

# Set column names
df.columns = ['filename', 'label', 'gender', 'split', 'speaker']

# Create output folders
os.makedirs("data/real", exist_ok=True)
os.makedirs("data/fake", exist_ok=True)

# Copy files based on label
for index, row in df.iterrows():
    filename = row['filename']
    label = row['label']
    
    # Build source path
    source = os.path.join(r"C:\Users\girut\Downloads\dataset_IT", filename)
    
    if label == 'bonafide':
        shutil.copy(source, "data/real/")
    elif label == 'deepfake':
        shutil.copy(source, "data/fake/")
    
print(f"✅ Copied {len(df)} files!")
print(f"Real files: {len(os.listdir('data/real'))}")
print(f"Fake files: {len(os.listdir('data/fake'))}")