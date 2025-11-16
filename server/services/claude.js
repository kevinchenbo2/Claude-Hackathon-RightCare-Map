// Task 3.1: Claude Service Module
// Healthcare navigation assistant using Claude AI

import Anthropic from '@anthropic-ai/sdk';

// Task 3.1: Initialize client with API key from env
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Task 3.2: Design system prompt for medical navigation
const SYSTEM_PROMPT = `You are a healthcare navigation assistant for CareCompass AI. Your role is to help people decide WHERE to seek care based on their symptoms - you are NOT a diagnostic tool and do NOT provide medical diagnoses.

IMPORTANT DISCLAIMERS:
- You help people decide WHERE to seek care, not WHAT their condition is
- Always recommend seeking professional medical help for concerning symptoms
- You provide guidance, not medical advice
- In any emergency or life-threatening situation, recommend calling 911 immediately

URGENCY ASSESSMENT CRITERIA:
- SELF_CARE (Green): Minor symptoms that can be managed at home with rest, over-the-counter medications
  - Examples: mild cold symptoms, minor cuts, headache without other symptoms
- CLINIC (Yellow-Green): Non-urgent issues that should see a doctor within days
  - Examples: persistent cough, minor infections, routine concerns
- URGENT_CARE (Yellow): Needs prompt attention but not life-threatening
  - Examples: high fever, sprains, moderate pain, symptoms lasting several days
- ER/EMERGENCY (Red): Potentially life-threatening or severe symptoms
  - Examples: chest pain, difficulty breathing, severe bleeding, stroke symptoms

FINANCIAL GUIDANCE FRAMEWORK:
- LOW cost: Self-care options, generic OTC medications, telehealth visits
- MEDIUM cost: Clinic visits ($100-300), urgent care ($150-500)
- HIGH cost: Emergency room visits ($1000+), hospitalization

Consider the user's insurance status when providing financial guidance:
- "Good insurance": Focus on finding in-network providers, co-pays typically manageable
- "High deductible/unsure": Suggest cost-effective options, urgent care over ER when safe
- "No insurance": Emphasize community clinics, sliding scale options, cost transparency

You MUST respond with ONLY a valid JSON object in the following exact format (no markdown, no explanation outside JSON):
{
  "urgency_level": "self_care" | "clinic" | "urgent_care" | "er",
  "urgency_color": "green" | "yellow" | "red",
  "recommended_care_type": "string describing the recommended type of care",
  "reasoning_summary": "2-3 sentence explanation of why this care level is recommended",
  "doctor_summary": "A brief professional summary that can be shared with a healthcare provider",
  "red_flags": ["array of any concerning symptoms that warrant immediate attention"],
  "financial_category": "low" | "medium" | "high",
  "financial_explanation": "Explanation of expected costs and financial considerations based on insurance status",
  "suggested_search_queries": ["array of search terms to find appropriate facilities nearby"]
}`;

// Task 3.5: Parse and validate Claude response
function parseAndValidateResponse(responseText) {
  let parsed;

  try {
    // Remove any potential markdown code blocks
    const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    parsed = JSON.parse(cleanedText);
  } catch (error) {
    throw new Error('Failed to parse Claude response as JSON');
  }

  // Validate required fields
  const requiredFields = [
    'urgency_level',
    'urgency_color',
    'recommended_care_type',
    'reasoning_summary',
    'doctor_summary',
    'red_flags',
    'financial_category',
    'financial_explanation',
    'suggested_search_queries'
  ];

  const missingFields = requiredFields.filter(field => !(field in parsed));

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields in response: ${missingFields.join(', ')}`);
  }

  // Validate enum values
  const validUrgencyLevels = ['self_care', 'clinic', 'urgent_care', 'er'];
  const validUrgencyColors = ['green', 'yellow', 'red'];
  const validFinancialCategories = ['low', 'medium', 'high'];

  if (!validUrgencyLevels.includes(parsed.urgency_level)) {
    throw new Error(`Invalid urgency_level: ${parsed.urgency_level}`);
  }

  if (!validUrgencyColors.includes(parsed.urgency_color)) {
    throw new Error(`Invalid urgency_color: ${parsed.urgency_color}`);
  }

  if (!validFinancialCategories.includes(parsed.financial_category)) {
    throw new Error(`Invalid financial_category: ${parsed.financial_category}`);
  }

  // Validate array fields
  if (!Array.isArray(parsed.red_flags)) {
    throw new Error('red_flags must be an array');
  }

  if (!Array.isArray(parsed.suggested_search_queries)) {
    throw new Error('suggested_search_queries must be an array');
  }

  return parsed;
}

// Task 3.3 & 3.4: Implement analysis function with text-only and image support
export async function analyzeSymptoms(symptoms, location, insuranceStatus, imageData = null) {
  // Construct user message content
  let userContent;

  if (imageData) {
    // Task 3.4: Handle text+image scenario
    // Extract media type and base64 data from data URL if needed
    let mediaType = 'image/jpeg';
    let base64Data = imageData;

    if (imageData.startsWith('data:')) {
      const matches = imageData.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        mediaType = matches[1];
        base64Data = matches[2];
      }
    }

    userContent = [
      {
        type: 'image',
        source: {
          type: 'base64',
          media_type: mediaType,
          data: base64Data
        }
      },
      {
        type: 'text',
        text: `User Location: ${location}
Insurance Status: ${insuranceStatus}

Symptoms/Concerns:
${symptoms}

Please analyze these symptoms and provide guidance on where to seek care. If an image is provided, consider any visible symptoms or conditions shown.`
      }
    ];
  } else {
    // Task 3.3: Handle text-only scenario
    userContent = `User Location: ${location}
Insurance Status: ${insuranceStatus}

Symptoms/Concerns:
${symptoms}

Please analyze these symptoms and provide guidance on where to seek care.`;
  }

  // Task 3.3: Call Claude API
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: userContent
      }
    ]
  });

  // Task 3.5: Extract text content from response
  const textContent = response.content.find(block => block.type === 'text');

  if (!textContent) {
    throw new Error('No text content in Claude response');
  }

  // Parse and validate the response
  const parsedResponse = parseAndValidateResponse(textContent.text);

  return parsedResponse;
}

export default { analyzeSymptoms };
