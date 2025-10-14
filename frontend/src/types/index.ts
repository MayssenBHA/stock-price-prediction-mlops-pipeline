/**
 * TypeScript Type Definitions
 */

export interface PredictionData {
  dates: string[];
  values: number[];
}

export interface PredictionResponse {
  actual_data: PredictionData;
  historical_predictions: PredictionData;
  future_predictions: PredictionData;
  metadata: {
    total_input_records: number;
    prediction_periods: number;
    model_time_steps: number;
  };
}

export interface UploadResponse {
  message: string;
  filename: string;
  filepath: string;
  size: number;
}

export interface ModelInfo {
  model: string;
  time_steps: number;
  input_dims: number;
  lstm_units: number;
  train_min: number;
  train_max: number;
}
