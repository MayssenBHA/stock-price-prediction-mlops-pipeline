# Stock Price Prediction - Frontend

React + TypeScript frontend for visualizing stock price predictions with interactive charts.

## Features

- **File Upload** with drag-and-drop support
- **Flexible Prediction Periods** (days, weeks, months)
- **Interactive Charts** using Chart.js
- **Real-time Predictions** with loading states
- **Responsive Design** with Tailwind CSS
- **Modern UI** with Lucide React icons

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **React-Chartjs-2** - Chart.js wrapper
- **Axios** - HTTP client
- **React-Dropzone** - File upload
- **Lucide React** - Icons

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── FileUpload.tsx          # CSV upload component
│   │   ├── PredictionForm.tsx      # Period selection form
│   │   ├── ChartVisualization.tsx  # Chart display
│   │   └── Layout.tsx              # Page layout
│   ├── services/
│   │   └── api.ts                  # API client
│   ├── types/
│   │   └── index.ts                # TypeScript types
│   ├── styles/
│   │   └── index.css               # Global styles
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # Entry point
│   └── vite-env.d.ts              # Vite types
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── Dockerfile
└── README.md
```

## Setup Instructions

### Local Development

1. **Install Node.js** (v18 or higher)

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
```

Built files will be in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Docker Deployment

1. **Build Docker image:**
   ```bash
   docker build -t stock-prediction-frontend .
   ```

2. **Run container:**
   ```bash
   docker run -p 3000:80 stock-prediction-frontend
   ```

## Usage Guide

### 1. Upload CSV File

- Click or drag-and-drop a CSV file
- CSV must contain columns: `date`, `close`, `open`, `high`, `low`, `volume`
- File is validated before upload

### 2. Select Prediction Period

- Choose number of periods
- Select unit: Days, Weeks, or Months
- Business days are calculated automatically

### 3. Generate Predictions

- Click "Predict" button
- Wait for model to process
- View interactive chart with results

### 4. Interpret Results

- **Blue line:** Historical actual data
- **Red dashed line:** Future predictions
- Chart shows seamless connection between actual and predicted data
- Hover over points for detailed values

## Components

### FileUpload

Handles CSV file selection with drag-and-drop support.

**Props:**
- `onFileSelect: (file: File) => void` - File selection callback
- `selectedFile: File | null` - Currently selected file
- `onClear: () => void` - Clear file callback

### PredictionForm

Form for selecting prediction parameters.

**Props:**
- `onPredict: (periods: number) => void` - Prediction callback
- `isLoading: boolean` - Loading state
- `disabled: boolean` - Disable form

### ChartVisualization

Interactive chart displaying predictions.

**Props:**
- `data: PredictionResponse` - Prediction data from API

### Layout

Page layout with header and footer.

**Props:**
- `children: React.ReactNode` - Page content

## API Integration

The frontend communicates with the FastAPI backend:

```typescript
// Upload file
const response = await uploadFile(file);

// Make prediction
const result = await makePrediction(file, periods);

// Get model info
const info = await getModelInfo();
```

## Customization

### Styling

Modify `tailwind.config.js` to customize colors and theme:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',
      secondary: '#EF4444',
    },
  },
}
```

### Chart Configuration

Edit `ChartVisualization.tsx` to modify chart appearance:

```typescript
const options = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { text: 'Your Custom Title' },
  },
};
```

## Environment Variables

- `VITE_API_URL` - Backend API base URL

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port already in use
```bash
# Change port in vite.config.ts
server: { port: 3001 }
```

### API connection errors
- Verify backend is running on `http://localhost:8000`
- Check CORS settings in backend
- Update `VITE_API_URL` in `.env`

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT License
