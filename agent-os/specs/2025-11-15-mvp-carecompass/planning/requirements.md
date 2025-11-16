# CareCompass AI - MVP Implementation

## Overview
Implement the complete MVP for CareCompass AI hackathon demo - a single-page PERN stack application that helps users find appropriate healthcare based on their symptoms, insurance status, and location.

## Core Requirements (Phase 1 from Roadmap)

### 1. Input Panel UI
- Location input (auto-detect or manual city entry)
- Symptom text area ("What's going on?")
- Optional image upload for visual symptoms (rash/injury/swelling)
- Insurance status selector:
  - Good insurance
  - High deductible / unsure
  - No insurance
- Submit button to trigger AI analysis

### 2. Claude AI Integration
- Backend API endpoint to handle symptom analysis requests
- System prompt for cautious medical navigation (NOT diagnosis)
- Support for text-only and text+image inputs
- Structured JSON response with:
  - urgency_level (self_care, clinic, urgent_care, er)
  - urgency_color (green, yellow, red)
  - recommended_care_type
  - reasoning_summary
  - doctor_summary (third-person for check-in)
  - red_flags array
  - financial_category
  - financial_explanation
  - suggested_search_queries

### 3. AI Result Panel
- Color-coded urgency badge (🟢🟡🔴)
- Recommended care type display
- Financial estimate with insurance-specific guidance
- Doctor-ready summary (copyable)
- Red flag warnings section
- Clear disclaimers (not medical diagnosis)

### 4. Google Maps Integration
- Map component centered on user location
- Color-coded facility markers:
  - 🟢 Clinics / community health centers
  - 🟡 Urgent care facilities
  - 🔴 Hospitals / ERs
- List of facilities with clickable Google Maps links
- Dynamic search queries based on AI recommendation

### 5. Single Page Layout
- Responsive design (mobile-friendly)
- Three-panel layout: Input | Results | Map
- Clean, accessible UI with clear visual hierarchy
- Loading states during AI processing

### 6. Backend API Structure
- Express.js server with proper middleware (cors, helmet)
- POST /api/analyze endpoint for symptom analysis
- Environment variable management for API keys
- Error handling and input validation
- Rate limiting consideration

### 7. End-to-End Flow
- User enters location + symptoms + insurance status
- Optional: User uploads symptom image
- Frontend sends request to backend
- Backend calls Claude API with structured prompt
- Backend returns parsed JSON response
- Frontend displays results and updates map
- User can click facility links to open Google Maps

## Technical Stack
- Frontend: React 18+, Tailwind CSS, @react-google-maps/api
- Backend: Express.js 4.x, Node.js
- AI: Claude API (claude-sonnet-4-20250514 or similar)
- Maps: Google Maps JavaScript API
- Database: PostgreSQL (minimal use for MVP - focus on stateless flow)

## Success Criteria
- Complete symptom-to-recommendation flow works end-to-end
- AI returns appropriate urgency levels for different symptom severities
- Financial guidance adapts to insurance status
- Map displays relevant healthcare facilities
- Application handles errors gracefully
- UI is intuitive and accessible

## Hackathon Context
This is a 3-hour hackathon build focusing on "Build for Good" theme. The MVP should demonstrate:
- Healthcare navigation intelligence
- Financial accessibility awareness
- Visual symptom analysis capability
- Geographic care discovery
