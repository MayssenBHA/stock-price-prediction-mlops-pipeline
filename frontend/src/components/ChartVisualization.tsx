import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { PredictionResponse } from '../types';
import { TrendingUp, TrendingDown, Calendar, DollarSign, Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartVisualizationProps {
  data: PredictionResponse;
}

const ChartVisualization: React.FC<ChartVisualizationProps> = ({ data }) => {
  // Get the predicted value and last actual value
  const predictedValue = data.future_predictions.values[0];
  const lastActualValue = data.actual_data.values[data.actual_data.values.length - 1];
  const priceChange = predictedValue - lastActualValue;
  const percentChange = ((priceChange / lastActualValue) * 100).toFixed(2);
  const isPositive = priceChange >= 0;
  // Combine all dates
  const allDates = [
    ...data.actual_data.dates,
    ...data.future_predictions.dates,
  ];

  // Prepare chart data
  const chartData = {
    labels: allDates,
    datasets: [
      {
        label: 'Actual Data',
        data: [
          ...data.actual_data.values,
          ...new Array(data.future_predictions.dates.length).fill(null),
        ],
        borderColor: 'rgb(59, 130, 246)', // Blue
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5,
        tension: 0.1,
      },
      {
        label: 'Future Predictions',
        data: [
          ...new Array(data.actual_data.dates.length - 1).fill(null),
          data.actual_data.values[data.actual_data.values.length - 1], // Connect to last actual value
          ...data.future_predictions.values,
        ],
        borderColor: 'rgb(239, 68, 68)', // Red
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5,
        tension: 0.1,
        borderDash: [5, 5], // Dashed line for predictions
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Stock Price Prediction - Time Series Analysis',
        font: {
          size: 18,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 20,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Close Price (USD)',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
        ticks: {
          callback: function (value: any) {
            return '$' + value.toFixed(2);
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Prediction Result Card - Featured */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <TrendingUp className="h-8 w-8" />
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium">Next Day Prediction</p>
              <p className="text-xs text-blue-200">{data.future_predictions.dates[0]}</p>
            </div>
          </div>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
            isPositive ? 'bg-green-500/30' : 'bg-red-500/30'
          }`}>
            {isPositive ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
            <span className="font-bold">{isPositive ? '+' : ''}{percentChange}%</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-blue-100 text-sm mb-2">Predicted Close Price</p>
            <p className="text-5xl font-bold tracking-tight">
              ${predictedValue.toFixed(2)}
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-white/20">
            <div>
              <p className="text-blue-100 text-xs mb-1">Last Known Price</p>
              <p className="text-xl font-semibold">${lastActualValue.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-xs mb-1">Expected Change</p>
              <p className={`text-xl font-semibold ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
                {isPositive ? '+' : ''}${Math.abs(priceChange).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="h-[500px]">
          <Line data={chartData} options={options} />
        </div>
      </div>
      
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500 rounded-lg p-3">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-200 px-3 py-1 rounded-full">
              DATA
            </span>
          </div>
          <h4 className="text-sm font-medium text-purple-900 mb-1">Input Records</h4>
          <p className="text-3xl font-bold text-purple-600">
            {data.metadata.total_input_records}
          </p>
          <p className="text-xs text-purple-600 mt-2">Historical data points analyzed</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 rounded-lg p-3">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-200 px-3 py-1 rounded-full">
              FORECAST
            </span>
          </div>
          <h4 className="text-sm font-medium text-blue-900 mb-1">Prediction Horizon</h4>
          <p className="text-3xl font-bold text-blue-600">
            {data.metadata.prediction_periods} {data.metadata.prediction_periods === 1 ? 'Day' : 'Days'}
          </p>
          <p className="text-xs text-blue-600 mt-2">Next trading day forecast</p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-500 rounded-lg p-3">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-200 px-3 py-1 rounded-full">
              MODEL
            </span>
          </div>
          <h4 className="text-sm font-medium text-emerald-900 mb-1">Time Steps Used</h4>
          <p className="text-3xl font-bold text-emerald-600">
            {data.metadata.model_time_steps}
          </p>
          <p className="text-xs text-emerald-600 mt-2">Days of historical context</p>
        </div>
      </div>
    </div>
  );
};

export default ChartVisualization;
