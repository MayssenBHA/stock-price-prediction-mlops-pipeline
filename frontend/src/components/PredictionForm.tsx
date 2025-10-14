import { TrendingUp, Calendar } from 'lucide-react';

interface PredictionFormProps {
  onPredict: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onPredict, isLoading, disabled }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Calendar className="mr-2 h-5 w-5 text-blue-600" />
        Next Day Prediction
      </h3>
      
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-800">
            The model will predict the <strong>next day's closing price</strong> based on the last 6 days of historical data in your uploaded file.
          </p>
        </div>

        <button
          type="submit"
          disabled={disabled || isLoading}
          className={`
            w-full flex items-center justify-center px-6 py-3 rounded-md
            text-white font-medium transition-colors duration-200
            ${
              disabled || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }
          `}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Predicting...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-5 w-5" />
              Predict Next Day
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PredictionForm;
