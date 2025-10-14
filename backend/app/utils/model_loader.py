"""
Model Loader Utility
Load trained models, scalers, and configuration
"""
import os
import pickle
from typing import Dict, Any
from keras.models import Model
from app.models.attention_cnn_lstm import attention_model


class ModelLoader:
    """Load and manage trained models and artifacts"""
    
    def __init__(self, models_dir: str = "saved_models"):
        self.models_dir = models_dir
        self.model = None
        self.scaler = None
        self.config = None
        
    def load_all(self) -> Dict[str, Any]:
        """
        Load all model artifacts
        Returns:
            dict with model, scaler, and config
        """
        self.load_keras_model()
        self.load_scaler()
        self.load_config()
        
        return {
            'model': self.model,
            'scaler': self.scaler,
            'config': self.config
        }
    
    def load_keras_model(self) -> Model:
        """Load Keras model with pre-trained weights"""
        model_path = os.path.join(self.models_dir, 'stock_model.h5')
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        # Build model architecture
        self.model = attention_model(INPUT_DIMS=6, TIME_STEPS=6, lstm_units=50)
        
        # Load pre-trained weights
        self.model.load_weights(model_path)
        
        print(f"✓ Loaded Keras model from {model_path}")
        return self.model
    
    def load_scaler(self):
        """Load MinMaxScaler"""
        scaler_path = os.path.join(self.models_dir, 'stock_scaler.pkl')
        
        if not os.path.exists(scaler_path):
            raise FileNotFoundError(f"Scaler file not found: {scaler_path}")
        
        with open(scaler_path, 'rb') as f:
            self.scaler = pickle.load(f)
        
        print(f"✓ Loaded scaler from {scaler_path}")
        return self.scaler
    
    def load_config(self) -> Dict[str, Any]:
        """Load model configuration"""
        config_path = os.path.join(self.models_dir, 'model_config.pkl')
        
        if not os.path.exists(config_path):
            raise FileNotFoundError(f"Config file not found: {config_path}")
        
        with open(config_path, 'rb') as f:
            self.config = pickle.load(f)
        
        print(f"✓ Loaded config from {config_path}")
        return self.config


# Global model loader instance
model_loader = ModelLoader()

def get_model_artifacts():
    """Get loaded model artifacts (singleton pattern)"""
    if model_loader.model is None:
        model_loader.load_all()
    
    return {
        'model': model_loader.model,
        'scaler': model_loader.scaler,
        'config': model_loader.config
    }
