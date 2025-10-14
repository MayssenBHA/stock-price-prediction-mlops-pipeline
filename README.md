# Stock Price Prediction - Full Stack Application

A complete full-stack application for time series stock price prediction using Attention-Based CNN-LSTM deep learning model.

![Project Architecture](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react)
![Docker](https://img.shields.io/badge/Docker-Deployment-2496ED?style=for-the-badge&logo=docker)

## 🚀 Features

- **Upload CSV files** with historical stock data
- **Generate predictions** using deep learning model
- **Visualize results** with interactive charts
- **Docker support** for easy deployment
- **RESTful API** for integration

## 📊 Model Architecture

**Attention-Based CNN-LSTM** with the following components:

1. **ARIMA Residuals** - Additional feature engineering
2. **1D CNN Layer** - Temporal feature extraction
3. **Bidirectional LSTM** - Sequential pattern learning
4. **Attention Mechanism** - Focus on important time steps
5. **Dense Output** - Final prediction

### Model Specifications
- **Time Steps:** 6
- **Input Features:** 6 (close, open, high, low, volume, ARIMA residuals)
- **LSTM Units:** 50
- **Activation:** Sigmoid for output

## 🏗️ Project Structure

```
dep_branch/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── main.py            # API entry point
│   │   ├── api/routes/        # API endpoints
│   │   ├── models/            # Model architecture
│   │   ├── services/          # Business logic
│   │   └── utils/             # Utilities
│   ├── saved_models/          # Trained models
│   ├── uploads/               # Temporary uploads
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API client
│   │   ├── types/             # TypeScript types
│   │   └── styles/            # CSS styles
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
│
├── docker-compose.yml         # Docker orchestration
├── att_cnn_lstm.py           # Model training script
└── README.md                  # This file
```

## 🔧 Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **TensorFlow/Keras** - Deep learning
- **Statsmodels** - ARIMA time series
- **Scikit-learn** - Data preprocessing
- **Pandas & NumPy** - Data manipulation

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Chart.js** - Visualization
- **Axios** - HTTP client

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server (frontend)

## 📋 Prerequisites

- **Python 3.9+**
- **Node.js 18+**
- **Docker & Docker Compose** (for containerized deployment)

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd dep_branch
   ```

2. **Place model files** in `backend/saved_models/`:
   - `stock_model.h5`
   - `stock_scaler.pkl`
   - `model_config.pkl`

3. **Start with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Option 2: Local Development

#### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd app
uvicorn main:app --reload --port 8000
```

#### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 📝 Usage

### 1. Prepare Your Data

Create a CSV file with the following format:

```csv
date,close,open,high,low,volume
2021-01-01,100.5,99.2,101.3,98.5,1000000
2021-01-02,102.3,100.5,103.0,100.1,1200000
...
```

### 2. Upload CSV File

- Open the web interface at http://localhost:3000
- Drag and drop your CSV file or click to browse
- File is validated automatically

### 3. Generate Predictions

- Click "Predict" button
- Wait for model processing
- View interactive chart with results

### 4. Interpret Results

- **Blue line:** Historical actual prices
- **Red dashed line:** Future predictions
- **Statistics:** Input records, predicted periods, model info
- Hover over chart points for detailed values

## 🔌 API Endpoints

### Upload File
```http
POST /api/upload
Content-Type: multipart/form-data
```

### Make Prediction
```http
POST /api/predict
Content-Type: multipart/form-data

file: <CSV file>
periods: 30
```

### Get Model Info
```http
GET /api/model-info
```

For detailed API documentation, visit: http://localhost:8000/docs

## 🎓 Training Your Own Model

1. **Prepare your training data** in CSV format

2. **Run the training script:**
   ```bash
   python att_cnn_lstm.py
   ```

3. **Model artifacts will be saved:**
   - `stock_model.h5` - Neural network weights
   - `stock_scaler.pkl` - MinMaxScaler
   - `model_config.pkl` - Model configuration

4. **Move files to backend:**
   ```bash
   mv stock_model.h5 stock_scaler.pkl model_config.pkl backend/saved_models/
   ```

## 🐳 Docker Commands

### Build images
```bash
docker-compose build
```

### Start services
```bash
docker-compose up
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

### Restart single service
```bash
docker-compose restart backend
```

## 📊 Model Performance

Expected metrics on test data:
- **RMSE:** < 5%
- **MAE:** < 3%
- **R²:** > 0.95
- **MAPE:** < 5%

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Built with ❤️ using FastAPI, React, and TensorFlow**
