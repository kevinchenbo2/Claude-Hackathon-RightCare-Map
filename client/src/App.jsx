import { useState, useEffect } from 'react';
import './App.css';
import InputPanel from './components/InputPanel';
import ResultPanel from './components/ResultPanel';
import MapPanel from './components/MapPanel';
import { analyzeSymptoms } from './utils/api';

function App() {
  const [location, setLocation] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Task 8.1: Wire up form submission to API
  // Task 8.2: Handle successful API response
  // Task 8.3: Handle API errors gracefully
  // Task 8.4: Update location state from form
  const handleAnalyze = async (formData) => {
    // Set isLoading to true before call
    setIsLoading(true);
    // Clear any previous errors
    setError(null);

    try {
      // Call API utility's analyzeSymptoms with form data as payload
      const result = await analyzeSymptoms(formData);

      // Set analysisResult state with response data
      setAnalysisResult(result);
      // Update location state from form submission
      setLocation(formData.location);
      // Set isLoading to false on success
      setIsLoading(false);
    } catch (err) {
      // Set isLoading to false on error
      setIsLoading(false);

      // Set error state with user-friendly message
      let errorMessage = 'Unable to analyze symptoms at this time. Please try again.';

      if (err.response) {
        // Server responded with error status
        if (err.response.status === 400) {
          errorMessage = err.response.data?.error || 'Invalid request. Please check your input and try again.';
        } else if (err.response.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (err.response.status === 500) {
          errorMessage = 'Server error. Our AI service may be temporarily unavailable.';
        }
      } else if (err.request) {
        // No response received
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      }

      setError(errorMessage);
      console.error('Analysis error:', err);
    }
  };

  const handleFacilitySelect = (facility) => {
    setSelectedFacility(facility);
  };

  // Clear error and allow retry
  const handleClearError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">CareCompass AI</h1>
          <p className="text-sm text-gray-600">Find the right care, right now</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Task 8.6: Global Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-lg p-4 shadow-md">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <h3 className="text-red-800 font-semibold mb-1">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-3">
              <button
                onClick={handleClearError}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Retry
              </button>
              <button
                onClick={handleClearError}
                className="px-4 py-2 bg-white hover:bg-gray-100 text-red-700 font-medium rounded-md border border-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Task 8.5: Pass all necessary props to components */}
        {/* Three-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[30%_35%_35%] gap-6">
          {/* InputPanel: onSubmit handler, isLoading */}
          <InputPanel onSubmit={handleAnalyze} isLoading={isLoading} />

          {/* ResultPanel: analysisResult, isLoading */}
          <ResultPanel analysisResult={analysisResult} isLoading={isLoading} />

          {/* MapPanel: location, analysisResult, facilities (imported internally) */}
          <MapPanel
            location={location}
            analysisResult={analysisResult}
            selectedFacility={selectedFacility}
            onFacilitySelect={handleFacilitySelect}
          />
        </div>
      </main>

      {/* Footer with Disclaimers */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600 font-medium">
              This is not medical advice. Always seek professional medical help for serious symptoms.
            </p>
            <p className="text-xs text-gray-500">
              Your symptoms are analyzed in real-time and not stored.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
