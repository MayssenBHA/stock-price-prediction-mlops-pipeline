"""
Prediction API Routes
Handle file upload and prediction requests
"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
import os
from datetime import datetime

from app.utils.model_loader import get_model_artifacts
from app.services.prediction_service import PredictionService

router = APIRouter()

# Load models on startup (singleton)
artifacts = None


def get_prediction_service():
    """Get prediction service instance"""
    global artifacts
    if artifacts is None:
        artifacts = get_model_artifacts()
    
    return PredictionService(
        model=artifacts['model'],
        scaler=artifacts['scaler'],
        config=artifacts['config']
    )


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload CSV file
    Args:
        file: CSV file with columns [date, close, open, high, low, volume]
    Returns:
        JSON with file info
    """
    # Validate file type
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are allowed"
        )
    
    # Read file content
    content = await file.read()
    
    try:
        file_content = content.decode('utf-8')
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="Invalid CSV file encoding. Please use UTF-8."
        )
    
    # Save file to uploads directory
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    filepath = os.path.join("uploads", filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(file_content)
    
    return JSONResponse(
        status_code=200,
        content={
            "message": "File uploaded successfully",
            "filename": filename,
            "filepath": filepath,
            "size": len(content)
        }
    )


@router.post("/predict")
async def predict(
    file: UploadFile = File(...)
):
    """
    Make stock price predictions for the next day
    Args:
        file: CSV file with historical data
    Returns:
        JSON with actual data and next-day prediction
    """
    # Always predict only 1 day ahead
    periods = 1
    
    # Validate file
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are allowed"
        )
    
    # Read file content
    content = await file.read()
    
    try:
        file_content = content.decode('utf-8')
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="Invalid CSV file encoding"
        )
    
    # Get prediction service
    try:
        service = get_prediction_service()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load model: {str(e)}"
        )
    
    # Make predictions
    try:
        result = service.predict_from_csv(file_content, periods)
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid CSV format: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )
    
    return JSONResponse(
        status_code=200,
        content=result
    )


@router.get("/model-info")
async def get_model_info():
    """Get model information"""
    try:
        artifacts = get_model_artifacts()
        config = artifacts['config']
        
        return {
            "model": "Attention-Based CNN-LSTM",
            "time_steps": config['TIME_STEPS'],
            "input_dims": config['INPUT_DIMS'],
            "lstm_units": config['lstm_units'],
            "train_min": config['train_min'],
            "train_max": config['train_max']
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get model info: {str(e)}"
        )
