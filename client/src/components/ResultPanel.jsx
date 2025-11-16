import { useState, useEffect } from 'react';
import { FaInfoCircle, FaExclamationTriangle, FaDollarSign, FaCopy, FaCheck } from 'react-icons/fa';
import UrgencyBadge from './UrgencyBadge';

// Skeleton placeholder component for loading states
function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Urgency badge skeleton */}
      <div className="text-center">
        <div className="inline-block w-32 h-12 bg-gray-200 rounded-full"></div>
        <div className="h-8 bg-gray-200 rounded mt-4 w-3/4 mx-auto"></div>
      </div>

      {/* Reasoning card skeleton */}
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial card skeleton */}
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor summary skeleton */}
      <div className="border-2 border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
}

function ResultPanel({ analysisResult, isLoading }) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (analysisResult) {
      setVisible(false);
      const timer = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(timer);
    }
  }, [analysisResult]);

  const handleCopyToClipboard = async () => {
    if (analysisResult?.doctor_summary) {
      try {
        await navigator.clipboard.writeText(analysisResult.doctor_summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = analysisResult.doctor_summary;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (fallbackErr) {
          console.error('Failed to copy text:', fallbackErr);
        }
        document.body.removeChild(textArea);
      }
    }
  };

  const formatFinancialCategory = (category) => {
    if (!category) return '';
    return category.charAt(0).toUpperCase() + category.slice(1) + ' Cost';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 text-blue-600">
            <svg
              className="animate-spin h-6 w-6"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-gray-600 font-medium">Analyzing your symptoms...</span>
          </div>
        </div>
        <SkeletonLoader />
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-500 text-lg">Submit symptoms to see recommendations</p>
          <p className="text-gray-400 text-sm mt-2">
            Your personalized care guidance will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 overflow-y-auto max-h-[calc(100vh-200px)] transition-all duration-300">
      <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>

      <div
        className={`space-y-6 transition-all duration-500 ease-out transform ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Urgency Badge and Care Type */}
        <div className="text-center">
          <UrgencyBadge
            urgencyLevel={analysisResult.urgency_level}
            urgencyColor={analysisResult.urgency_color}
          />
          <h3 className="text-2xl font-bold text-gray-900 mt-4">
            {analysisResult.recommended_care_type}
          </h3>
        </div>

        {/* Reasoning Summary Card */}
        <div className="bg-blue-50 rounded-lg p-4 shadow-md transform transition-all duration-300 hover:shadow-lg">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-blue-600 mt-1 flex-shrink-0 text-xl" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Why This Recommendation</h4>
              <p className="text-gray-700 leading-relaxed">
                {analysisResult.reasoning_summary}
              </p>
            </div>
          </div>
        </div>

        {/* Red Flags Warning Section */}
        {analysisResult.red_flags && analysisResult.red_flags.length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 shadow-md transform transition-all duration-300 hover:shadow-lg animate-pulse-once">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-red-600 mt-1 flex-shrink-0 text-xl" />
              <div>
                <h4 className="font-semibold text-red-900 mb-2">Warning Signs</h4>
                <ul className="list-disc list-inside space-y-1">
                  {analysisResult.red_flags.map((flag, index) => (
                    <li key={index} className="text-red-800">
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Financial Guidance Card */}
        <div className="bg-emerald-50 rounded-lg p-4 shadow-md transform transition-all duration-300 hover:shadow-lg">
          <div className="flex items-start gap-3">
            <FaDollarSign className="text-emerald-600 mt-1 flex-shrink-0 text-xl" />
            <div>
              <h4 className="font-semibold text-emerald-900 mb-2">
                {formatFinancialCategory(analysisResult.financial_category)}
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {analysisResult.financial_explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Doctor Summary Box with Copy Button */}
        <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 transform transition-all duration-300 hover:shadow-lg">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-semibold text-gray-900">Summary for Healthcare Provider</h4>
            <button
              onClick={handleCopyToClipboard}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Copy summary to clipboard"
            >
              {copied ? (
                <>
                  <FaCheck className="text-emerald-600" />
                  <span className="text-emerald-600 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <FaCopy className="text-gray-600" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="text-gray-700 leading-relaxed italic">
            {analysisResult.doctor_summary}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResultPanel;
