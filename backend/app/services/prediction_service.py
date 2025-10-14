"""
Prediction Service
Handle time series prediction logic
"""
import pandas as pd
import numpy as np
from typing import Dict, List
from app.services.data_processor import DataProcessor


class PredictionService:
    """Service for making stock price predictions"""
    
    def __init__(self, model, scaler, config):
        self.model = model
        self.scaler = scaler
        self.config = config
        self.processor = DataProcessor(scaler, config)
        self.TIME_STEPS = config['TIME_STEPS']
    
    def predict_from_csv(
        self, 
        file_content: str, 
        prediction_periods: int
    ) -> Dict[str, any]:
        """
        Make predictions from uploaded CSV
        Args:
            file_content: CSV content as string
            prediction_periods: number of periods to predict ahead
        Returns:
            dict with actual and predicted data
        """
        # Step 1: Process CSV
        data = self.processor.process_csv(file_content)
        
        # Step 2: Add ARIMA residuals
        data = self.processor.add_arima_residuals(data)
        
        # Step 3: Scale data
        data_scaled = self.processor.scale_data(data)
        
        # Step 4: Create sequences
        sequences = self.processor.create_sequences(data_scaled)
        
        # Step 5: Make predictions on historical data
        historical_predictions = self.model.predict(sequences, verbose=0)
        historical_predictions_unscaled = self.processor.inverse_scale_predictions(
            historical_predictions
        )
        
        # Step 6: Generate future predictions
        future_predictions = self._predict_future(
            data_scaled, 
            prediction_periods
        )
        future_predictions_unscaled = self.processor.inverse_scale_predictions(
            future_predictions
        )
        
        # Step 7: Prepare dates
        historical_dates = data.index[self.TIME_STEPS:].tolist()
        last_date = pd.to_datetime(data.index[-1])
        future_dates = pd.bdate_range(
            start=last_date + pd.Timedelta(days=1),
            periods=prediction_periods
        )
        
        # Step 8: Prepare response
        response = {
            "actual_data": {
                "dates": [str(d) for d in historical_dates],
                "values": data['close'].iloc[self.TIME_STEPS:].tolist()
            },
            "historical_predictions": {
                "dates": [str(d) for d in historical_dates],
                "values": historical_predictions_unscaled.flatten().tolist()
            },
            "future_predictions": {
                "dates": future_dates.strftime('%Y-%m-%d').tolist(),
                "values": future_predictions_unscaled.flatten().tolist()
            },
            "metadata": {
                "total_input_records": len(data),
                "prediction_periods": prediction_periods,
                "model_time_steps": self.TIME_STEPS
            }
        }
        
        return response
    
    def _predict_future(
        self, 
        data_scaled: np.ndarray, 
        periods: int
    ) -> np.ndarray:
        """
        Recursive multi-step ahead prediction
        Args:
            data_scaled: scaled historical data
            periods: number of periods to predict
        Returns:
            array of future predictions
        """
        # Use last TIME_STEPS as seed
        last_sequence = data_scaled[-self.TIME_STEPS:].copy()
        
        predictions = []
        
        for _ in range(periods):
            # Reshape for model input: (1, TIME_STEPS, n_features)
            current_input = last_sequence.reshape(1, self.TIME_STEPS, 6)
            
            # Predict next step
            next_pred = self.model.predict(current_input, verbose=0)
            predictions.append(next_pred[0, 0])
            
            # Create new row with predicted value
            # Duplicate predicted close for all features (simplified approach)
            # Set residuals to 0
            new_row = np.array([
                next_pred[0, 0],  # close
                next_pred[0, 0],  # open
                next_pred[0, 0],  # high
                next_pred[0, 0],  # low
                next_pred[0, 0],  # volume
                0.0               # residuals
            ])
            
            # Slide window: remove first, add new prediction
            last_sequence = np.vstack([last_sequence[1:], new_row])
        
        return np.array(predictions).reshape(-1, 1)
