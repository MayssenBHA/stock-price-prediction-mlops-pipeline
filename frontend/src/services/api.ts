/**
 * API Service
 * Handle all API calls to FastAPI backend
 */
import axios from 'axios';
import type { PredictionResponse, UploadResponse, ModelInfo } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

/**
 * Upload CSV file
 */
export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<UploadResponse>('/upload', formData);
  return response.data;
};

/**
 * Make prediction for next day
 */
export const makePrediction = async (
  file: File
): Promise<PredictionResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<PredictionResponse>('/predict', formData);
  return response.data;
};

/**
 * Get model information
 */
export const getModelInfo = async (): Promise<ModelInfo> => {
  const response = await api.get<ModelInfo>('/model-info');
  return response.data;
};

export default api;
