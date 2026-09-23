from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import uuid
import aiofiles

router = APIRouter()

UPLOAD_DIR = "uploads"

# Create uploads folder if it doesn't exist
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/detect")
async def detect_deepfake(file: UploadFile = File(...)):
    """
    Accepts an audio file and returns a fake/real prediction.
    """
    # Check file extension
    allowed_extensions = [".wav", ".mp3", ".flac", ".m4a"]
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File type not supported. Allowed: {', '.join(allowed_extensions)}"
        )
    
    # Save file temporarily
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}{file_ext}")
    
    async with aiofiles.open(file_path, "wb") as f:
        content = await file.read()
        await f.write(content)
    
    # For now, return a placeholder response
    # We'll add actual ML prediction in the next step
    return {
        "filename": file.filename,
        "file_id": file_id,
        "message": "File uploaded successfully. ML analysis coming soon.",
        "verdict": "PENDING",
        "confidence": None
    }