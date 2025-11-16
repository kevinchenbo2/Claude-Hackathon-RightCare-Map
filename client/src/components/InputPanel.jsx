import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';

function InputPanel({ onSubmit, isLoading }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      location: '',
      symptoms: '',
      insuranceStatus: 'high_deductible',
    },
  });

  // Handle geolocation auto-detect
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Use coordinates as location (in production, would reverse geocode)
        const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        setValue('location', locationString);
        setIsGettingLocation(false);
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enter your city manually.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Handle image upload and conversion to base64
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setImagePreview(null);
      setImageBase64(null);
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      event.target.value = '';
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Only JPEG and PNG images are accepted');
      event.target.value = '';
      return;
    }

    // Create preview and convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Resize image to max 1024px width
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > 1024) {
          height = (height * 1024) / width;
          width = 1024;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Get base64 data
        const resizedDataUrl = canvas.toDataURL(file.type, 0.9);
        setImagePreview(resizedDataUrl);

        // Extract base64 portion (remove data:image/xxx;base64, prefix)
        const base64Data = resizedDataUrl.split(',')[1];
        setImageBase64({
          data: base64Data,
          media_type: file.type,
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Clear image
  const handleClearImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form submission
  const onFormSubmit = (data) => {
    const payload = {
      symptoms: data.symptoms,
      location: data.location,
      insuranceStatus: data.insuranceStatus,
      image: imageBase64,
    };
    onSubmit(payload);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Describe Your Symptoms</h2>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {/* Location Input */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="location"
              placeholder="Enter your city or address"
              className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('location', { required: 'Location is required' })}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isLoading || isGettingLocation}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              aria-label="Auto-detect location"
            >
              {isGettingLocation ? (
                <span className="flex items-center gap-1">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Detecting...
                </span>
              ) : (
                'Auto-detect'
              )}
            </button>
          </div>
          {errors.location && (
            <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
          )}
          {locationError && <p className="mt-1 text-sm text-red-500">{locationError}</p>}
        </div>

        {/* Symptoms Textarea */}
        <div>
          <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
            Symptoms <span className="text-red-500">*</span>
          </label>
          <textarea
            id="symptoms"
            rows={6}
            placeholder="Describe what's going on..."
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
              errors.symptoms ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('symptoms', {
              required: 'Please describe your symptoms',
              minLength: {
                value: 10,
                message: 'Please provide at least 10 characters',
              },
            })}
            disabled={isLoading}
          />
          {errors.symptoms && (
            <p className="mt-1 text-sm text-red-500">{errors.symptoms.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Upload Image (Optional)
          </label>
          <input
            type="file"
            id="image"
            ref={fileInputRef}
            accept="image/jpeg,image/png"
            onChange={handleImageUpload}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none"
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-gray-500">Max size: 5MB. Accepted formats: JPEG, PNG</p>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-3 relative inline-block">
              <img
                src={imagePreview}
                alt="Uploaded symptom"
                className="max-w-full h-auto max-h-48 rounded-md border border-gray-300"
              />
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Remove image"
                disabled={isLoading}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Insurance Status Radio Group */}
        <div>
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-2">
              Insurance Status <span className="text-red-500">*</span>
            </legend>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="good_insurance"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  {...register('insuranceStatus', { required: 'Please select your insurance status' })}
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-700">Good insurance</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="high_deductible"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  {...register('insuranceStatus', { required: 'Please select your insurance status' })}
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-700">High deductible / unsure</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="no_insurance"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  {...register('insuranceStatus', { required: 'Please select your insurance status' })}
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-700">No insurance</span>
              </label>
            </div>
            {errors.insuranceStatus && (
              <p className="mt-1 text-sm text-red-500">{errors.insuranceStatus.message}</p>
            )}
          </fieldset>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Analyzing...
            </>
          ) : (
            'Analyze Symptoms'
          )}
        </button>
      </form>
    </div>
  );
}

export default InputPanel;
