"""
Data Processor Service
Handle CSV upload, ARIMA residuals, and data preprocessing
"""
import pandas as pd
import numpy as np
import statsmodels.api as sm
from typing import Tuple
from io import StringIO


class DataProcessor:
    """Process uploaded CSV data for prediction"""
    
    def __init__(self, scaler, config):
        self.scaler = scaler
        self.config = config
        self.TIME_STEPS = config['TIME_STEPS']
    
    def process_csv(self, file_content: str) -> pd.DataFrame:
        """
        Process uploaded CSV file
        Args:
            file_content: CSV file content as string
        Returns:
            processed dataframe
        """
        # Read CSV
        data = pd.read_csv(StringIO(file_content))
        
        # Skip first row if needed (like in original code)
        if len(data) > 1:
            data = data.iloc[1:, :]
        
        # Validate required columns
        required_cols = ['date', 'close', 'open', 'high', 'low', 'volume']
        missing_cols = [col for col in required_cols if col not in data.columns]
        
        if missing_cols:
            raise ValueError(f"Missing required columns: {missing_cols}")
        
        return data
    
    def add_arima_residuals(self, data: pd.DataFrame) -> pd.DataFrame:
        """
        Fit ARIMA model and add residuals as feature
        Args:
            data: dataframe with 'close' column
        Returns:
            dataframe with residuals column added
        """
        # Fit ARIMA(0, 1, 0) model on close prices
        model = sm.tsa.ARIMA(endog=data['close'], order=(0, 1, 0)).fit()
        residuals = pd.DataFrame(model.resid, columns=['residuals'])
        
        # Merge residuals with original data
        data = data.reset_index(drop=True)
        residuals = residuals.reset_index(drop=True)
        data = pd.concat([data, residuals], axis=1)
        
        # Set date as index
        data.set_index('date', inplace=True)
        
        return data
    
    def scale_data(self, data: pd.DataFrame) -> np.ndarray:
        """
        Scale data using pre-fitted scaler
        Args:
            data: dataframe with features [close, open, high, low, volume, residuals]
        Returns:
            scaled numpy array
        """
        # Select feature columns in correct order
        features = ['close', 'open', 'high', 'low', 'volume', 'residuals']
        data_features = data[features].values
        
        # Transform using pre-fitted scaler
        data_scaled = self.scaler.transform(data_features)
        
        return data_scaled
    
    def create_sequences(self, data_scaled: np.ndarray) -> np.ndarray:
        """
        Create sequences for time series prediction
        Args:
            data_scaled: scaled data array
        Returns:
            sequences array of shape (n_samples, TIME_STEPS, n_features)
        """
        dataX = []
        for i in range(len(data_scaled) - self.TIME_STEPS):
            a = data_scaled[i:(i + self.TIME_STEPS), :]
            dataX.append(a)
        
        return np.array(dataX)
    
    def inverse_scale_predictions(self, predictions: np.ndarray) -> np.ndarray:
        """
        Inverse transform predictions to original scale
        Args:
            predictions: scaled predictions
        Returns:
            unscaled predictions
        """
        train_min = self.config['train_min']
        train_max = self.config['train_max']
        
        predictions_unscaled = predictions * (train_max - train_min) + train_min
        
        return predictions_unscaled
