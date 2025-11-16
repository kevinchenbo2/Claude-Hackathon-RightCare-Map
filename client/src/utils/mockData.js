// Mock data for demo backup when API fails
// This ensures the demo can continue regardless of API availability

export const mockResponses = {
  // Minor symptoms - Green/Self Care or Clinic
  minor: {
    urgency_level: 'clinic',
    urgency_color: 'green',
    recommended_care_type: 'Primary Care Clinic',
    reasoning_summary: 'Your symptoms suggest a minor condition that can be safely evaluated at a primary care clinic. These symptoms are typically manageable with over-the-counter treatments or a routine doctor visit. No immediate emergency care is needed.',
    doctor_summary: 'Patient presents with mild symptoms including headache. No fever, no neurological symptoms, no red flags observed. Recommend evaluation for potential tension headache or minor viral illness. Consider OTC pain relief and follow-up if symptoms persist beyond 48-72 hours.',
    red_flags: [],
    financial_category: 'low',
    financial_explanation: 'A primary care visit is the most cost-effective option for your symptoms. With good insurance, expect a copay of $20-50. Without insurance, community health centers offer sliding scale fees based on income, typically $50-150 for a visit.',
    suggested_search_queries: ['primary care clinic', 'family doctor', 'community health center']
  },

  // Moderate symptoms - Yellow/Urgent Care
  moderate: {
    urgency_level: 'urgent_care',
    urgency_color: 'yellow',
    recommended_care_type: 'Urgent Care Center',
    reasoning_summary: 'Your symptoms warrant prompt medical attention but are not immediately life-threatening. An urgent care center can provide same-day evaluation and treatment. They have diagnostic capabilities like labs and X-rays that may be needed to properly assess your condition.',
    doctor_summary: 'Patient reports persistent fever of 102F for 3 days with body aches and fatigue. Fever responds to antipyretics but recurs. No respiratory symptoms noted. Requires evaluation to rule out bacterial infection, possible need for cultures or bloodwork. Monitor for worsening symptoms.',
    red_flags: [
      'Fever persisting beyond 3 days',
      'Temperature exceeding 102F'
    ],
    financial_category: 'moderate',
    financial_explanation: 'Urgent care visits typically cost $100-200 with insurance (after copay) or $150-300 without insurance. This is significantly less expensive than an ER visit while still providing prompt professional care. Many urgent care centers offer payment plans.',
    suggested_search_queries: ['urgent care center', 'walk-in clinic', 'immediate care']
  },

  // Severe symptoms - Red/Emergency Room
  severe: {
    urgency_level: 'er',
    urgency_color: 'red',
    recommended_care_type: 'Emergency Room - SEEK IMMEDIATE CARE',
    reasoning_summary: 'YOUR SYMPTOMS REQUIRE IMMEDIATE EMERGENCY MEDICAL ATTENTION. Chest pain with radiating arm pain and shortness of breath are classic warning signs of a potential heart attack. Time is critical - call 911 or go to the nearest emergency room immediately. Do not drive yourself.',
    doctor_summary: 'CRITICAL: Patient experiencing acute chest pain with pressure sensation, radiation to left arm, associated dyspnea and nausea. Classic presentation concerning for acute coronary syndrome. Requires immediate cardiac workup including ECG, troponins, and continuous monitoring. High-risk presentation requiring emergent evaluation.',
    red_flags: [
      'Chest pain with pressure sensation',
      'Pain radiating to left arm',
      'Shortness of breath',
      'Nausea accompanying chest pain',
      'POSSIBLE HEART ATTACK - CALL 911'
    ],
    financial_category: 'high',
    financial_explanation: 'Emergency room care is expensive but this is a potentially life-threatening situation where cost should not be a barrier. Federal law requires ERs to provide stabilizing care regardless of ability to pay. Hospitals have financial assistance programs and payment plans. Your life is the priority - seek care immediately.',
    suggested_search_queries: ['emergency room', 'hospital ER', 'emergency services']
  }
};

// Helper function to determine which mock response to use based on symptoms
export const getMockResponse = (symptoms) => {
  const symptomLower = symptoms.toLowerCase();

  // Check for severe/emergency keywords
  if (
    symptomLower.includes('chest pain') ||
    symptomLower.includes('can\'t breathe') ||
    symptomLower.includes('difficulty breathing') ||
    symptomLower.includes('severe bleeding') ||
    symptomLower.includes('unconscious') ||
    symptomLower.includes('stroke') ||
    symptomLower.includes('heart attack') ||
    symptomLower.includes('radiating') ||
    symptomLower.includes('crushing')
  ) {
    return mockResponses.severe;
  }

  // Check for moderate/urgent care keywords
  if (
    symptomLower.includes('fever') ||
    symptomLower.includes('persistent') ||
    symptomLower.includes('3 days') ||
    symptomLower.includes('worsening') ||
    symptomLower.includes('infection') ||
    symptomLower.includes('vomiting') ||
    symptomLower.includes('dehydrated') ||
    symptomLower.includes('high temperature')
  ) {
    return mockResponses.moderate;
  }

  // Default to minor symptoms
  return mockResponses.minor;
};

// Flag to enable/disable mock mode
export const USE_MOCK_DATA = false; // Set to true to force mock responses for testing
