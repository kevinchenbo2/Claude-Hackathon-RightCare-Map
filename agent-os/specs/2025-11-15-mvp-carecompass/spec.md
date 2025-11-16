# Specification: CareCompass AI MVP

## Goal
Build a complete single-page PERN stack application that helps users navigate healthcare decisions by providing AI-powered symptom triage, insurance-aware cost guidance, and a color-coded map of nearby healthcare facilities within a 3-hour hackathon timeframe.

## User Stories
- As a traveler experiencing health issues in an unfamiliar city, I want to describe my symptoms and see recommended care level with nearby facilities so that I can get appropriate care without overpaying
- As an uninsured person with concerning symptoms, I want to understand the financial implications of different care options so that I can make informed decisions about where to seek treatment
- As a parent unsure about my child's symptoms, I want to see clear urgency indicators and red flag warnings so that I know whether to seek immediate emergency care

## Specific Requirements

**Input Panel Component**
- Text input field for city/location with geolocation auto-detect button using browser's Geolocation API
- Multi-line textarea for symptom description with placeholder text "Describe what's going on..."
- File input accepting image/jpeg and image/png for visual symptoms with 5MB max size limit
- Radio button group for insurance status: "Good insurance", "High deductible / unsure", "No insurance"
- Submit button that disables during API processing and shows loading spinner
- Form validation preventing submission without location and symptoms filled
- Use React Hook Form for form state management
- Tailwind CSS for responsive layout that stacks vertically on mobile

**Claude AI Backend Service**
- Express.js POST endpoint at /api/triage/analyze accepting JSON body with: symptoms (string), image (base64 string, optional), location (string), insuranceStatus (enum)
- System prompt that positions Claude as a healthcare navigation assistant, NOT a diagnostic tool
- Prompt must emphasize: "You help people decide WHERE to seek care, not WHAT condition they have"
- Include instruction to return structured JSON with exact schema (no markdown, no explanations outside JSON)
- Use claude-sonnet-4-20250514 model with max_tokens: 1024
- Parse Claude response as JSON and validate all required fields before returning to frontend
- Return 500 error with user-friendly message if Claude API fails or returns malformed response
- Environment variable ANTHROPIC_API_KEY for API authentication

**AI Response JSON Schema**
- urgency_level: enum of "self_care" | "clinic" | "urgent_care" | "er" indicating recommended care level
- urgency_color: enum of "green" | "yellow" | "red" for visual indicator mapping
- recommended_care_type: human-readable string like "Urgent Care Center" or "Emergency Room"
- reasoning_summary: 2-3 sentence explanation of why this care level is recommended
- doctor_summary: professional third-person summary suitable for showing at check-in (50-100 words)
- red_flags: array of strings listing any concerning symptoms requiring immediate attention (can be empty)
- financial_category: cost tier based on insurance status and care type
- financial_explanation: specific dollar ranges and what to expect for billing
- suggested_search_queries: array of 2-3 Google Maps search terms for finding relevant facilities

**Result Panel Display**
- Large color-coded urgency badge component using Tailwind classes: bg-green-500, bg-yellow-500, bg-red-500
- Bold heading showing recommended_care_type
- Card section displaying reasoning_summary with appropriate iconography
- Collapsible or highlighted section for red_flags array (only shown if array is non-empty)
- Financial guidance card showing financial_category and financial_explanation
- Doctor summary box with copy-to-clipboard button using navigator.clipboard API
- Medical disclaimer footer: "This is not medical advice. Always seek professional medical help for serious symptoms."
- Smooth fade-in animation when results load using Tailwind transition utilities

**Google Maps Integration**
- Use @react-google-maps/api library with GoogleMap and Marker components
- Center map on user's location coordinates (convert city name to lat/lng using Geocoding API)
- Map container sized to fill available panel space with minimum height of 400px
- Custom marker icons or colors: green markers for clinics, yellow for urgent care, red for hospitals
- InfoWindow popup on marker click showing facility name and address
- Generate Google Maps navigation URLs in format: https://www.google.com/maps/dir/?api=1&destination={address}
- Environment variable REACT_APP_GOOGLE_MAPS_API_KEY for Maps JavaScript API

**Facility Data Population**
- For MVP: hardcode 9-12 sample facilities for a demo city (San Francisco recommended)
- Data structure: { id, name, type (clinic|urgent_care|hospital), lat, lng, address, phone }
- Filter facilities to show based on AI's suggested_search_queries or recommended care type
- Display facility list below map with clickable rows that open Google Maps directions
- Show distance from user (calculate using Haversine formula or Google Distance Matrix API)
- Sort facilities by distance from user location

**Single Page Layout Architecture**
- Three-column grid layout on desktop: 30% Input | 35% Results | 35% Map
- Stack vertically on mobile: Input -> Results -> Map (using Tailwind responsive breakpoints)
- Fixed header with app logo/name "CareCompass AI" and tagline
- Sticky positioning for map panel on desktop so it remains visible while scrolling results
- Minimum viewport support: 375px width (iPhone SE)
- Use CSS Grid or Flexbox for main layout structure
- Semantic HTML with proper ARIA labels for accessibility

**State Management and Data Flow**
- App.jsx as main orchestrator holding shared state: location, analysisResult, selectedFacility, isLoading
- Pass state and handlers as props to child components (InputPanel, ResultPanel, MapPanel)
- Use React useState hooks for component-level state
- Use React useEffect for side effects like fetching facilities after location is set
- Optional: React Context for deeply nested state sharing
- Clear loading and error states throughout user journey

**Error Handling Strategy**
- Network errors: Display "Unable to connect to server. Please check your internet connection."
- Claude API errors: Display "Unable to analyze symptoms at this time. Please try again."
- Invalid user input: Inline validation messages below form fields
- Geolocation denied: Fall back to manual city input with message "Location access denied. Please enter your city."
- Empty API response: Display generic error with retry button
- Log all errors to console for debugging during hackathon demo
- Never expose raw error messages or stack traces to users

**Security and Privacy Implementation**
- All Claude API calls made from backend only (API key never exposed to frontend)
- Use helmet middleware for Express security headers
- CORS configuration allowing only frontend origin
- Rate limiting: express-rate-limit middleware, 10 requests per minute per IP
- Input sanitization: strip HTML tags from symptom text, validate image MIME types
- No persistent storage of symptom data or images during MVP
- Clear prominent disclaimer on frontend: "Your symptoms are analyzed in real-time and not stored"
- Image processing: resize to max 1024px width before sending to Claude to reduce payload

**Backend API Structure**
- /server/index.js: Express app setup with middleware stack (cors, helmet, express.json, morgan)
- /server/routes/triage.js: POST /analyze endpoint handler
- /server/services/claude.js: Anthropic API client wrapper with prompt construction
- /server/middleware/validation.js: Request body validation using Zod or manual checks
- Port configuration via environment variable (default 3001)
- Health check endpoint GET /api/health returning { status: "ok", timestamp }
- Request logging with morgan in development mode

**Frontend Component Structure**
- /client/src/App.jsx: Main layout grid, state management, API call orchestration
- /client/src/components/InputPanel.jsx: Form with location, symptoms, image, insurance
- /client/src/components/ResultPanel.jsx: AI response display with all sections
- /client/src/components/MapPanel.jsx: Google Maps container with markers and facility list
- /client/src/components/UrgencyBadge.jsx: Reusable color-coded badge component
- /client/src/components/LoadingSpinner.jsx: Animated loading indicator
- /client/src/utils/api.js: Axios or fetch wrapper for backend calls
- /client/src/data/facilities.js: Hardcoded facility data for demo

## Visual Design

No visual mockups provided. Design should follow these guidelines:
- Clean, medical-professional aesthetic with white background and subtle gray borders
- Color palette: green (#10B981) for safe, yellow (#F59E0B) for caution, red (#EF4444) for urgent
- Sans-serif font family (system-ui or Inter) for readability
- Generous whitespace and padding (p-4, p-6 Tailwind classes)
- Card-based UI with subtle shadows (shadow-md) for distinct sections
- Consistent border radius (rounded-lg) across components
- Mobile-first responsive design approach

## Existing Code to Leverage

This is a greenfield project with no existing codebase. The following external libraries and patterns should be adopted:

**@react-google-maps/api Library**
- Well-documented React wrapper for Google Maps
- Use LoadScript component for API loading, GoogleMap for container, Marker for pins
- Follow library's recommended patterns for useLoadScript hook and useCallback for event handlers

**Anthropic Claude SDK Pattern**
- Use official @anthropic-ai/sdk npm package for Node.js
- Structured messages array format with system prompt and user content
- Vision capability for image analysis requires content array with text and image objects

**Tailwind CSS Utility Patterns**
- Leverage built-in color palette for consistent urgency colors
- Use responsive prefixes (md:, lg:) for breakpoint-specific layouts
- Apply transition and animate utilities for smooth state changes

**Express.js Best Practices**
- Middleware composition pattern for request processing pipeline
- Router-level separation for different resource endpoints
- Async/await with try-catch for clean error handling

**React Hook Form Integration**
- useForm hook for form state and validation
- register function for input binding
- handleSubmit for form submission with validation

## Out of Scope
- User authentication, accounts, or session management
- Persistent database storage of user symptoms or history
- Real-time facility data (wait times, operating hours, insurance acceptance)
- Multi-language support or internationalization
- Telehealth integration or virtual care options
- Appointment booking functionality
- Medical record integration or storage
- HIPAA compliance certification (disclaimer suffices for MVP)
- Payment processing or actual insurance verification
- Native mobile applications (web-only MVP)
- Offline functionality or Progressive Web App features
- Admin dashboard or analytics reporting
- Facility reviews or ratings
- Follow-up symptom tracking or reminders
- Integration with actual healthcare provider APIs
- Automated testing suite (manual testing only for hackathon)
- Production deployment configuration
- Custom domain or SSL setup
- Performance optimization beyond basic image resizing
- Accessibility audit or WCAG compliance verification
- SEO optimization or meta tags
