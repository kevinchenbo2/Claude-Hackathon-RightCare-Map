// Task 3.6: Triage Router
// Handles symptom analysis requests

import express from 'express';
import { analyzeSymptoms } from '../services/claude.js';

// Task 3.6: Create router
const router = express.Router();

// Task 3.7 & 3.8: POST /api/triage/analyze endpoint with error handling
router.post('/analyze', async (req, res) => {
  try {
    // Task 3.7: Extract request body fields
    const { symptoms, image, location, insuranceStatus } = req.body;

    // Task 3.7: Validate required fields
    const validationErrors = [];

    if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length === 0) {
      validationErrors.push('symptoms is required and must be a non-empty string');
    }

    if (!location || typeof location !== 'string' || location.trim().length === 0) {
      validationErrors.push('location is required and must be a non-empty string');
    }

    if (!insuranceStatus || typeof insuranceStatus !== 'string') {
      validationErrors.push('insuranceStatus is required and must be a string');
    }

    // Task 3.8: Return 400 for validation errors
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors
      });
    }

    // Task 3.7: Call analyzeSymptoms service
    // Handle image data - check if it's an object with data and media_type
    let imageData = null;
    if (image) {
      if (typeof image === 'object' && image.data && image.media_type) {
        // Construct data URL from base64 data
        imageData = `data:${image.media_type};base64,${image.data}`;
      } else if (typeof image === 'string') {
        imageData = image;
      }
    }

    const analysisResult = await analyzeSymptoms(
      symptoms.trim(),
      location.trim(),
      insuranceStatus,
      imageData
    );

    // Task 3.7: Return parsed JSON response directly (not wrapped)
    // Frontend expects the analysis result at the top level
    res.json(analysisResult);

  } catch (error) {
    // Log the actual error for debugging
    console.error('Triage analysis error:', error.message);
    console.error('Full error:', error);

    // Task 3.8: Return 500 for Claude API failures
    // Return user-friendly error messages
    if (error.message.includes('API') || error.message.includes('Anthropic')) {
      return res.status(500).json({
        error: 'Unable to analyze symptoms at this time. Please try again.',
        code: 'CLAUDE_API_ERROR'
      });
    }

    if (error.message.includes('parse') || error.message.includes('Missing required')) {
      return res.status(500).json({
        error: 'Error processing analysis results. Please try again.',
        code: 'PARSE_ERROR'
      });
    }

    // Generic server error
    res.status(500).json({
      error: 'An unexpected error occurred. Please try again.',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Task 3.6: Export router for mounting
export default router;
