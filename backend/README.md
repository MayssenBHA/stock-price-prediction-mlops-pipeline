# Stock Price Prediction - Backend

FastAPI backend for time series stock price prediction using Attention-Based CNN-LSTM deep learning model.

## Features

- **RESTful API** for stock price prediction
- **ARIMA residuals** as additional features
- **Attention-Based CNN-LSTM** neural network
- **Multi-step ahead prediction** (configurable periods)
- **CSV file upload** support
- **Docker support** for easy deployment

## Technology Stack

- **FastAPI** - Modern Python web framework
- **TensorFlow/Keras** - Deep learning framework
- **Statsmodels** - ARIMA time series analysis
- **Scikit-learn** - Data preprocessing
- **Pandas** - Data manipulation

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI application entry point
│   ├── api/
│   │   └── routes/
│   │       └── prediction.py      # API endpoints
│   ├── models/
│   │   └── attention_cnn_lstm.py  # Model architecture
│   ├── services/
│   │   ├── data_processor.py      # Data preprocessing
│   │   └── prediction_service.py  # Prediction logic
│   └── utils/
│       └── model_loader.py        # Load models and artifacts
├── saved_models/                  # Trained model files
│   ├── stock_model.h5            # Keras model weights
│   ├── stock_scaler.pkl          # MinMaxScaler
│   └── model_config.pkl          # Model configuration
├── uploads/                       # Temporary CSV uploads
├── requirements.txt
├── Dockerfile
└── README.md
```

## Setup Instructions

### Local Development

1. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Place model files** in `saved_models/` directory:
   - `stock_model.h5` (Keras model)
   - `stock_scaler.pkl` (MinMaxScaler)
   - `model_config.pkl` (Configuration)

4. **Run the server:**
   ```bash
   cd app
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

5. **Access API documentation:**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Docker Deployment

1. **Build Docker image:**
   ```bash
   docker build -t stock-prediction-backend .
   ```

2. **Run container:**
   ```bash
   docker run -p 8000:8000 -v $(pwd)/saved_models:/app/saved_models stock-prediction-backend
   ```

## API Endpoints

### 1. Upload CSV File
```http
POST /api/upload
Content-Type: multipart/form-data

file: <CSV file>
```

**Response:**
```json
{
  "message": "File uploaded successfully",
  "filename": "20231025_143022_data.csv",
  "filepath": "uploads/20231025_143022_data.csv",
  "size": 12345
}
```

### 2. Make Prediction
```http
POST /api/predict
Content-Type: multipart/form-data

file: <CSV file>
periods: 30
```

**Response:**
```json
{
  "actual_data": {
    "dates": ["2021-01-01", "2021-01-02", ...],
    "values": [100.5, 102.3, ...]
  },
  "historical_predictions": {
    "dates": ["2021-01-01", "2021-01-02", ...],
    "values": [100.2, 102.5, ...]
  },
  "future_predictions": {
    "dates": ["2022-01-01", "2022-01-02", ...],
    "values": [151.3, 152.1, ...]
  },
  "metadata": {
    "total_input_records": 500,
    "prediction_periods": 30,
    "model_time_steps": 6
  }
}
```

### 3. Get Model Info
```http
GET /api/model-info
```

**Response:**
```json
{
  "model": "Attention-Based CNN-LSTM",
  "time_steps": 6,
  "input_dims": 6,
  "lstm_units": 50,
  "train_min": 90.5,
  "train_max": 200.3
}
```

## CSV File Format

Your CSV file must contain the following columns:

```csv
date,close,open,high,low,volume
2021-01-01,100.5,99.2,101.3,98.5,1000000
2021-01-02,102.3,100.5,103.0,100.1,1200000
...
```

## Model Architecture

The prediction model uses an Attention-Based CNN-LSTM architecture:

1. **Input:** 6 features (close, open, high, low, volume, ARIMA residuals)
2. **CNN Layer:** 1D convolution with 50 filters
3. **Bidirectional LSTM:** 50 units with return sequences
4. **Attention Mechanism:** 3D attention block
5. **Output:** Single value (predicted close price)

## Environment Variables

- `PYTHONUNBUFFERED=1` - Disable Python output buffering
- `TF_CPP_MIN_LOG_LEVEL=2` - Reduce TensorFlow logging

## Troubleshooting

### Model files not found
- Ensure model files are in `saved_models/` directory
- Check file names match exactly: `stock_model.h5`, `stock_scaler.pkl`, `model_config.pkl`

### Import errors
- Reinstall dependencies: `pip install -r requirements.txt`
- Check Python version (3.9 or higher recommended)

### Prediction errors
- Verify CSV format has all required columns
- Check CSV encoding is UTF-8
- Ensure sufficient historical data (at least 10-20 records)

## License

MIT License
