import { useState } from 'react';
import Layout from './components/Layout';
import FileUpload from './components/FileUpload';
import PredictionForm from './components/PredictionForm';
import ChartVisualization from './components/ChartVisualization';
import { makePrediction } from './services/api';
import type { PredictionResponse } from './types';
import { AlertCircle } from 'lucide-react';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPredictionData(null);
    setError(null);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setPredictionData(null);
    setError(null);
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError('Please select a CSV file first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await makePrediction(selectedFile);
      setPredictionData(result);
    } catch (err: any) {
      console.error('Prediction error:', err);
      setError(
        err.response?.data?.detail ||
        err.message ||
        'Failed to make prediction. Please check your file and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-8 text-white">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-2">
                AI-Powered Stock Price Prediction
              </h2>
              <p className="text-blue-100 text-lg">
                Predict tomorrow's closing price using our advanced Attention-Based CNN-LSTM model
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload & Predict */}
          <div className="lg:col-span-1 space-y-6">
            <FileUpload
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              onClear={handleClearFile}
            />
            
            <PredictionForm
              onPredict={handlePredict}
              isLoading={isLoading}
              disabled={!selectedFile}
            />

            {/* Instructions */}
            {!predictionData && !isLoading && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Quick Start Guide
                </h3>
                <ol className="space-y-3 text-indigo-800">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                    <span>Upload your CSV file with historical stock data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                    <span>Required columns: <code className="bg-indigo-200 px-2 py-0.5 rounded text-xs">date, close, open, high, low, volume</code></span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                    <span>Click "Predict Next Day" to get tomorrow's forecast</span>
                  </li>
                </ol>
              </div>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 flex items-start mb-6 shadow-md">
                <AlertCircle className="h-6 w-6 text-red-600 mr-4 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-red-900 font-bold text-lg mb-2">Prediction Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Chart Visualization */}
            {predictionData && (
              <div className="animate-fade-in">
                <ChartVisualization data={predictionData} />
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <svg className="animate-spin h-16 w-16 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing Your Data...</h3>
                    <p className="text-gray-600">Our AI model is processing the historical data and generating predictions</p>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!predictionData && !isLoading && !error && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl p-12 text-center border-2 border-dashed border-gray-300">
                <svg className="mx-auto h-24 w-24 text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Predict</h3>
                <p className="text-gray-600 text-lg mb-6">Upload your CSV file and click predict to see AI-powered forecasts</p>
                <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-semibold">Powered by Attention-Based CNN-LSTM</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
