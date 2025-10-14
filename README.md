# Stock Price Prediction with Hybrid Deep Learning Models

A comprehensive time series forecasting project that combines traditional statistical methods (ARIMA) with advanced deep learning architectures to predict stock prices for Vietnamese telecommunications stocks (VGI - Viễn thông).

## 📊 Project Overview

This project implements and compares multiple time series forecasting approaches for stock price prediction:

- **Traditional Methods**: ARIMA, Exponential Smoothing
- **Deep Learning Models**: CNN-LSTM with Attention, Bidirectional GRU
- **Hybrid Approaches**: ARIMA + XGBoost, ARIMA + CNN-LSTM with Attention

All experiments are tracked using **MLflow** for comprehensive model management, versioning, and comparison.

## 🎯 Key Features

- **Multiple Model Architectures**: Implementation of 5+ different forecasting models
- **Attention Mechanism**: Custom attention layer for improved sequence learning
- **Hybrid Modeling**: Combines ARIMA residuals with deep learning models for enhanced predictions
- **MLflow Integration**: Complete experiment tracking, model registry, and artifact management
- **Comprehensive Evaluation**: Multiple metrics (MSE, RMSE, MAE, R², MAPE)
- **Feature Engineering**: Incorporates ARIMA residuals as additional features for deep learning models

## 📁 Project Structure

```
project/
├── 5.bidirectional-gru.ipynb          # Bidirectional GRU implementation
├── ARIMA.ipynb                        # ARIMA model and analysis
├── ARIMA_XGBoost.ipynb                # Hybrid ARIMA + XGBoost model
├── Att_CNN_LSTM.ipynb                 # CNN-LSTM with Attention mechanism
├── exponential_smoothing.ipynb        # Exponential smoothing methods
├── model.py                           # Model architectures and utilities
├── utils.py                           # Helper functions and metrics
├── requirements.txt                   # Project dependencies
├── Vienthong.csv                      # Raw stock data
├── vgi2.csv                           # Processed VGI stock data
├── ARIMA_residuals1.csv               # ARIMA model residuals
├── ARIMA.csv                          # ARIMA predictions on test set
├── ARIMA_Validation.csv               # ARIMA predictions on validation set
├── bidirectional_gru_model.h5         # Trained BiGRU model
├── stock_model.h5                     # Trained attention model
├── stock_normalize.npy                # Normalization parameters
├── test_set.csv                       # Test dataset
├── train.csv                          # Training dataset
├── valid.csv                          # Validation dataset
└── mlruns/                            # MLflow tracking directory
    ├── 1/                             # Experiment runs
    └── models/                        # Registered models
```

## 🛠️ Technologies Used

- **Python 3.x**
- **Deep Learning**: TensorFlow/Keras
- **Traditional ML**: Statsmodels, XGBoost, Scikit-learn
- **Experiment Tracking**: MLflow
- **Data Processing**: Pandas, NumPy
- **Visualization**: Matplotlib, Seaborn
- **Time Series**: Statsmodels, SciPy

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project
```

2. Install required dependencies:
```bash
pip install -r requirements.txt
```

## 🚀 Usage

### 1. ARIMA Model
```bash
jupyter notebook ARIMA.ipynb
```
- Performs stationarity tests (ADF, KPSS)
- Auto-selects optimal ARIMA parameters
- Generates residuals for hybrid models

### 2. Attention-based CNN-LSTM
```bash
jupyter notebook Att_CNN_LSTM.ipynb
```
- Combines ARIMA residuals with stock features
- Implements custom attention mechanism
- Tracks experiments with MLflow

### 3. Bidirectional GRU
```bash
jupyter notebook 5.bidirectional-gru.ipynb
```
- Implements BiGRU architecture
- Handles sequential dependencies
- Logs metrics and artifacts to MLflow

### 4. ARIMA + XGBoost Hybrid
```bash
jupyter notebook ARIMA_XGBoost.ipynb
```
- Uses ARIMA predictions as features
- Applies gradient boosting on residuals
- Walk-forward validation strategy

### 5. Exponential Smoothing
```bash
jupyter notebook exponential_smoothing.ipynb
```
- Simple, Holt's, and Holt-Winters methods
- Seasonal decomposition analysis
- Baseline comparison model

## 📊 Model Architectures

### Attention-based CNN-LSTM
```python
Input → Conv1D(64) → Dropout → BiLSTM(64) → Attention → Dense(1)
```
- Attention mechanism for learning temporal dependencies
- Conv1D for feature extraction
- Bidirectional LSTM for sequence modeling

### Bidirectional GRU
```python
Input → BiGRU layers → Dropout → Dense layers → Output
```
- Captures forward and backward temporal patterns
- More efficient than LSTM (fewer parameters)

### Hybrid ARIMA + XGBoost
```
ARIMA predictions + Residuals → XGBoost → Final predictions
```
- Combines statistical and ML approaches
- Uses ARIMA for trend/seasonality
- XGBoost for non-linear patterns

## 📈 Dataset

**Source**: Vietnamese stock market data (VGI - Viễn thông)

**Features**:
- `date`: Trading date
- `close`: Closing price (target variable)
- `open`: Opening price
- `high`: Highest price
- `low`: Lowest price
- `nmVolume`: Trading volume
- `Residual`: ARIMA model residuals (engineered feature)

**Data Split**:
- **Training**: Up to 2020-11-24
- **Validation**: 2020-11-25 to 2021-10-29
- **Test**: 2021-10-30 to 2021-12-31

**Preprocessing**:
- Date parsing and indexing
- Missing value interpolation (linear)
- Business day frequency alignment
- Min-Max normalization (0-1 scaling)

## 🔬 Evaluation Metrics

All models are evaluated using:
- **MSE** (Mean Squared Error)
- **RMSE** (Root Mean Squared Error)
- **MAE** (Mean Absolute Error)
- **R²** (R-squared Score)
- **MAPE** (Mean Absolute Percentage Error)

## 🗂️ MLflow Tracking

The project uses MLflow for comprehensive experiment tracking:

```python
mlflow.set_tracking_uri("sqlite:///mlflow.db")
mlflow.set_experiment("model_experiment")
```

**Tracked Items**:
- Model hyperparameters
- Training metrics (loss, accuracy)
- Evaluation metrics (MSE, RMSE, MAE, R²)
- Model artifacts (.h5 files, scalers, metadata)
- Predictions (CSV files)
- Data snapshots

**View MLflow UI**:
```bash
mlflow ui --backend-store-uri sqlite:///mlflow.db
```
Then open http://localhost:5000

## 📝 Key Functions

### From `model.py`:
- `attention_3d_block()`: Implements attention mechanism
- `attention_model()`: Builds attention-based CNN-LSTM
- `lstm()`: Creates LSTM variants (single/multi-layer, BiLSTM)
- `xgb_scheduler()`: Prepares data for XGBoost
- `walk_forward_validation()`: Time series cross-validation

### From `utils.py`:
- `adf_test()`: Augmented Dickey-Fuller stationarity test
- `acf_pacf_plot()`: Auto-correlation plots
- `create_dataset()`: Prepare sequential data
- `evaluation_metric()`: Calculate all metrics
- `NormalizeMult()`: Min-Max normalization
- `series_to_supervised()`: Convert time series to supervised learning format

## 🎓 Model Performance Insights

### Feature Engineering Impact
- **ARIMA Residuals**: Adding ARIMA residuals as features improves deep learning model performance by capturing linear patterns while allowing neural networks to learn non-linear relationships

### Attention Mechanism
- Dynamically weights important time steps
- Improves interpretability
- Better long-term dependency capture

### Hybrid Approach Benefits
- Combines statistical rigor with ML flexibility
- ARIMA handles trend/seasonality
- Deep learning captures complex patterns
- XGBoost handles non-linear residuals

## 🔄 Workflow

1. **Data Preprocessing** → Handle missing values, normalize features
2. **ARIMA Modeling** → Fit ARIMA, extract residuals, generate predictions
3. **Feature Engineering** → Merge residuals with original features
4. **Deep Learning** → Train CNN-LSTM/BiGRU with engineered features
5. **Hybrid Modeling** → Combine ARIMA + XGBoost
6. **Evaluation** → Compare all models using multiple metrics
7. **MLflow Tracking** → Log experiments, models, and artifacts

## 📊 Results Storage

- `*.h5`: Trained Keras models
- `*.npy`: Normalization parameters
- `*.csv`: Predictions and residuals
- `mlruns/`: MLflow experiment tracking
- `mlruns/models/`: Registered model versions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Note**: This project is for educational and research purposes. Stock price prediction is inherently uncertain, and these models should not be used as the sole basis for investment decisions.
