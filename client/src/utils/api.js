import axios from 'axios';
import { getMockResponse, USE_MOCK_DATA } from './mockData';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

export const analyzeSymptoms = async (data) => {
  // If mock mode is enabled, return mock data immediately
  if (USE_MOCK_DATA) {
    // Simulate network delay for realistic demo
    await new Promise(resolve => setTimeout(resolve, 1500));
    return getMockResponse(data.symptoms);
  }

  try {
    const response = await api.post('/api/triage/analyze', data);
    return response.data;
  } catch (error) {
    // If API fails and we have symptoms, fall back to mock data for demo continuity
    if (data.symptoms && (error.code === 'ECONNABORTED' || !error.response || error.response.status >= 500)) {
      console.warn('API unavailable, using mock data for demo backup');
      // Simulate some delay to make it feel realistic
      await new Promise(resolve => setTimeout(resolve, 1000));
      return getMockResponse(data.symptoms);
    }
    // Re-throw for other errors (validation errors, etc.)
    throw error;
  }
};

export default api;
