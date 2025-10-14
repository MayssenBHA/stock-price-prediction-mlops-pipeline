# stock-price-prediction-mlops-pipeline

![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![MLflow](https://img.shields.io/badge/MLflow-0194E2?style=for-the-badge&logo=mlflow&logoColor=white)

## 📖 Overview

This project implements a production-ready stock price prediction system that leverages hybrid deep learning architectures to forecast the next day's closing price. The system combines the statistical rigor of ARIMA with the pattern recognition capabilities of attention-based neural networks, providing accurate and interpretable one-day-ahead predictions.

**Target Dataset**: Vietnamese telecommunications stock market data (VGI - Viễn thông)

## 🎥 Video Demo

Watch the project in action:

👉 [Click here to watch the demo](https://drive.google.com/file/d/1V50PsSV7HAcKK5W4mGdgvKkTrOu9qnSL/view?usp=sharing)

### Research Foundation

In this project, I reuse and adapt relevant functions from related research to our specific research context. The core methodology and attention mechanism implementation are inspired by the paper:

**"Attention-based CNN-LSTM and XGBoost hybrid model for stock prediction"**  
📄 [arXiv:2204.02623](https://arxiv.org/abs/2204.02623)

This research demonstrates the effectiveness of combining attention mechanisms with hybrid architectures for financial time series forecasting, which forms the theoretical foundation of our implementation.

## 🎯 Project Goals

- **Research**: Explore and compare multiple time series forecasting architectures
- **Engineering**: Build a production-ready ML system with proper MLOps practices
- **Deployment**: Create a user-friendly web interface for end-users
- **Monitoring**: Track model performance and maintain model quality over time



## 🏗️ Repository Structure

This repository is organized into multiple branches, each serving a specific purpose in the ML lifecycle:

### 📊 `mlflow-tracking` Branch
**Focus**: Model development, experimentation, and tracking

Contains the complete research and development environment with:
- Multiple model implementations (ARIMA, CNN-LSTM with Attention, BiGRU, XGBoost)
- Comprehensive experiment tracking with MLflow
- Model evaluation and comparison
- Feature engineering pipelines
- Training notebooks and scripts

**Key Features**:
- 5+ different forecasting models
- Custom attention mechanism implementation
- Hybrid ARIMA + Deep Learning approaches
- Complete MLflow integration for experiment management
- Comprehensive evaluation metrics (MSE, RMSE, MAE, R², MAPE)

**Technologies**: TensorFlow/Keras, Statsmodels, XGBoost, MLflow, Pandas, NumPy

👉 [View mlflow-tracking Branch README](../../tree/mlflow-tracking/README.md)

### 🚀 `dep_branch` (Deployment Branch)
**Focus**: Production deployment and serving

Contains the full-stack application for serving predictions:
- FastAPI backend for model serving
- React frontend for user interface
- Docker containerization for easy deployment
- RESTful API with interactive documentation
- Real-time prediction visualization

**Key Features**:
- Upload CSV files with historical stock data
- Generate predictions using the trained attention model
- Interactive charts for visualizing results
- Docker Compose orchestration
- Production-ready API endpoints

**Technologies**: FastAPI, React, TypeScript, Tailwind CSS, Chart.js, Docker, Nginx

👉 [View dep_branch README](../../tree/dep_branch/README.md)

## 🤖 Model Architecture

### Attention-Based CNN-LSTM (Primary Model)

The core prediction model combines multiple architectural components:

```
Input Features (6D) → Conv1D (Feature Extraction) → 
Bidirectional LSTM (Sequence Learning) → 
Attention Mechanism (Temporal Focus) → 
Dense Layer → Predictions
```

**Input Features**:
1. Close price
2. Open price
3. High price
4. Low price
5. Trading volume
6. ARIMA residuals (engineered feature)

**Model Specifications**:
- Time steps: 6
- LSTM units: 50
- Attention mechanism: Custom implementation
- Output activation: Sigmoid
- Loss function: Mean Squared Error

### Why Attention Mechanism?

The attention mechanism allows the model to:
- Dynamically weight important time steps
- Improve interpretability by showing which historical periods matter most
- Capture long-term dependencies more effectively than standard LSTM
- Reduce vanishing gradient problems in deep networks

## 📊 Dataset & Features

**Source**: Vietnamese stock market (VGI - Viễn thông telecommunications)

**Features**:
- Historical OHLCV data (Open, High, Low, Close, Volume)
- ARIMA residuals as engineered features
- Date-indexed time series

**Data Split**:
- Training: Historical data up to 2020-11-24
- Validation: 2020-11-25 to 2021-10-29
- Test: 2021-10-30 to 2021-12-31

**Preprocessing**:
- Missing value interpolation
- Min-Max normalization (0-1 scaling)
- Business day frequency alignment
- Sequential windowing for supervised learning

## 🛠️ Technologies & Tools

### Machine Learning & Data Science
- **TensorFlow/Keras**: Deep learning model development
- **Statsmodels**: ARIMA and statistical methods
- **XGBoost**: Gradient boosting for hybrid models
- **Scikit-learn**: Data preprocessing and metrics
- **Pandas & NumPy**: Data manipulation

### MLOps & Tracking
- **MLflow**: Experiment tracking, model registry, artifact management
- **Docker**: Containerization and deployment
- **Docker Compose**: Multi-container orchestration

### Backend & API
- **FastAPI**: High-performance Python web framework
- **Uvicorn**: ASGI server
- **Python 3.9+**: Core programming language

### Frontend & Visualization
- **React 18**: Modern UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first styling
- **Chart.js**: Interactive data visualization
- **Axios**: HTTP client for API communication

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd stock-price-prediction
```

### 2. Choose Your Branch

**For Research & Model Development**:
```bash
git checkout mlflow-tracking
# Follow instructions in mlflow-tracking README
```

**For Deployment & Production**:
```bash
git checkout dep_branch
# Follow instructions in dep_branch README
```

### 3. Quick Deployment with Docker

```bash
git checkout dep_branch
docker-compose up --build
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📈 Model Performance

The attention-based CNN-LSTM model achieves strong performance on the test set:

- **RMSE**: < 5% of price range
- **MAE**: < 3% of price range
- **R²**: > 0.95
- **MAPE**: < 5%

These metrics demonstrate the model's ability to capture both short-term fluctuations and long-term trends in stock prices.

## 🔄 ML Workflow

```
1. Data Collection → Historical stock data (OHLCV + volume)
                     ↓
2. Preprocessing → Clean, normalize, create sequences
                     ↓
3. Feature Engineering → ARIMA residuals, technical indicators
                     ↓
4. Model Training → Attention CNN-LSTM with MLflow tracking
                     ↓
5. Evaluation → Multiple metrics, validation strategies
                     ↓
6. Model Registry → Save best models with MLflow
                     ↓
7. Deployment → FastAPI + React application
                     ↓
8. Serving → REST API for real-time predictions
                     ↓
9. Monitoring → [TODO] Grafana dashboards
```

## 🔮 Future Enhancements

### 🚧 Todo List

- [ ] **Grafana Integration**: Real-time monitoring dashboards for:
  - Model performance metrics
  - API response times
  - Prediction accuracy tracking
  - System health monitoring
  - Custom alerts for model drift

- [ ] **Infrastructure**:
  - Kubernetes deployment
  - CI/CD pipeline
  - Load balancing for high traffic
  - Caching layer for faster predictions

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Choose the appropriate branch:
   - `mlflow-tracking` for model improvements
   - `dep_branch` for deployment enhancements
3. Create your feature branch (`git checkout -b feature/AmazingFeature`)
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

### Development Guidelines

- Follow PEP 8 style guide for Python code
- Write unit tests for new features
- Update documentation for API changes
- Use type hints in Python code
- Follow React best practices for frontend

## 📝 Citation

If you use this project in your research or application, please cite:

**Inspired by**:
```bibtex
@article{attention_cnn_lstm_xgboost,
  title={Attention-based CNN-LSTM and XGBoost hybrid model for stock prediction},
  author={Authors},
  journal={arXiv preprint arXiv:2204.02623},
  year={2022}
}
```

## ⚠️ Disclaimer

This project is for educational and research purposes only. Stock price prediction is inherently uncertain and involves significant risk. The models and predictions provided by this system should **NOT** be used as the sole basis for investment decisions. Always consult with qualified financial advisors and conduct your own research before making investment decisions.

## 📧 Contact

For questions, suggestions, or collaborations, please open an issue or contact the maintainers.

---

**Built with ❤️ using TensorFlow, FastAPI, React, and MLflow**

*Making time series forecasting accessible, interpretable, and production-ready.*
