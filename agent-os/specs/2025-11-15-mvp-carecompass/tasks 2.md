# Task Breakdown: CareCompass AI MVP

## Overview
Total Tasks: 89 sub-tasks across 9 task groups
Estimated Time: 3 hours (hackathon timeframe)
Critical Path: Setup -> Backend -> Frontend Foundation -> Integration

---

## Task List

### Project Setup

#### Task Group 1: Environment and Project Initialization
**Dependencies:** None
**Estimated Time:** 20 minutes

- [x] 1.0 Complete project setup and configuration
  - [x] 1.1 Create project root structure
    - Create `/server` directory for Express backend
    - Create `/client` directory for React frontend
    - Files: `/server/`, `/client/`
  - [x] 1.2 Initialize backend Node.js project
    - Run `npm init -y` in server directory
    - Set "type": "module" for ES6 imports
    - Add start script: `"start": "node index.js"`
    - Add dev script: `"dev": "nodemon index.js"`
    - File: `/server/package.json`
  - [x] 1.3 Install backend dependencies
    - Core: `express cors helmet morgan dotenv`
    - Claude: `@anthropic-ai/sdk`
    - Utilities: `express-rate-limit`
    - Dev: `nodemon`
    - File: `/server/package.json`
  - [x] 1.4 Initialize React frontend with Vite
    - Run `npm create vite@latest . -- --template react`
    - Faster build times than Create React App
    - File: `/client/package.json`, `/client/vite.config.js`
  - [x] 1.5 Install frontend dependencies
    - Core: `axios react-hook-form`
    - Maps: `@react-google-maps/api`
    - Icons: `react-icons`
    - File: `/client/package.json`
  - [x] 1.6 Install and configure Tailwind CSS
    - Install: `tailwindcss postcss autoprefixer`
    - Run `npx tailwindcss init -p`
    - Configure content paths in tailwind.config.js
    - Add Tailwind directives to index.css
    - Files: `/client/tailwind.config.js`, `/client/postcss.config.js`, `/client/src/index.css`
  - [x] 1.7 Create environment variable templates
    - Backend .env: ANTHROPIC_API_KEY, PORT, NODE_ENV
    - Frontend .env: VITE_GOOGLE_MAPS_API_KEY, VITE_API_URL
    - Create .env.example files for documentation
    - Files: `/server/.env.example`, `/client/.env.example`, `/.gitignore`
  - [x] 1.8 Configure .gitignore
    - Ignore node_modules, .env files, build directories
    - Ignore IDE files (.vscode, .idea)
    - File: `/.gitignore`

**Acceptance Criteria:**
- Both server and client directories have package.json
- All dependencies installed successfully
- Tailwind CSS compiles without errors
- Environment variables template created
- Git ignores sensitive files

---

### Backend Foundation

#### Task Group 2: Express Server Setup
**Dependencies:** Task Group 1
**Estimated Time:** 15 minutes

- [ ] 2.0 Complete Express server foundation
  - [ ] 2.1 Create main server entry point
    - Import express, cors, helmet, morgan, dotenv
    - Configure dotenv at top of file
    - Create Express app instance
    - Set PORT from env or default 3001
    - File: `/server/index.js`
  - [ ] 2.2 Configure security middleware
    - Add helmet() for security headers
    - Add cors() with origin restriction to frontend URL
    - Add express.json() with 10MB limit for images
    - Add morgan('dev') for request logging
    - File: `/server/index.js`
  - [ ] 2.3 Add rate limiting middleware
    - Import express-rate-limit
    - Configure: 10 requests per minute per IP
    - Apply to /api routes
    - File: `/server/index.js`
  - [ ] 2.4 Create health check endpoint
    - GET /api/health
    - Return { status: "ok", timestamp: new Date().toISOString() }
    - File: `/server/index.js`
  - [ ] 2.5 Add error handling middleware
    - Global error handler at end of middleware chain
    - Log errors to console
    - Return user-friendly error messages
    - Never expose stack traces
    - File: `/server/index.js`
  - [ ] 2.6 Start server and verify
    - app.listen() with success console log
    - Test health endpoint returns 200
    - File: `/server/index.js`

**Acceptance Criteria:**
- Server starts without errors on port 3001
- Health endpoint returns valid JSON
- CORS configured correctly
- Rate limiting active
- Logging shows requests

---

### Claude AI Integration

#### Task Group 3: Claude API Service
**Dependencies:** Task Group 2
**Estimated Time:** 25 minutes

- [ ] 3.0 Complete Claude AI backend integration
  - [ ] 3.1 Create Claude service module
    - Import Anthropic SDK
    - Initialize client with API key from env
    - Export analyzeSymptoms function
    - File: `/server/services/claude.js`
  - [ ] 3.2 Design system prompt for medical navigation
    - Position as healthcare navigation assistant, NOT diagnostic tool
    - Emphasize: "You help people decide WHERE to seek care"
    - Include urgency assessment criteria
    - Include financial guidance framework
    - Specify exact JSON output schema required
    - File: `/server/services/claude.js`
  - [ ] 3.3 Implement text-only analysis function
    - Accept symptoms string, location, insuranceStatus
    - Construct messages array with system prompt
    - Call claude-sonnet-4-20250514 model
    - Set max_tokens: 1024
    - File: `/server/services/claude.js`
  - [ ] 3.4 Add image analysis support
    - Check if image base64 string provided
    - Construct content array with text and image objects
    - Format: { type: "image", source: { type: "base64", media_type, data } }
    - Handle both text-only and text+image scenarios
    - File: `/server/services/claude.js`
  - [ ] 3.5 Parse and validate Claude response
    - Extract text content from response
    - Parse as JSON
    - Validate required fields: urgency_level, urgency_color, recommended_care_type, reasoning_summary, doctor_summary, red_flags, financial_category, financial_explanation, suggested_search_queries
    - Throw error if validation fails
    - File: `/server/services/claude.js`
  - [ ] 3.6 Create triage router
    - Import express.Router()
    - Export router for mounting
    - File: `/server/routes/triage.js`
  - [ ] 3.7 Implement POST /api/triage/analyze endpoint
    - Extract symptoms, image, location, insuranceStatus from req.body
    - Validate required fields (symptoms, location, insuranceStatus)
    - Call analyzeSymptoms service
    - Return parsed JSON response
    - File: `/server/routes/triage.js`
  - [ ] 3.8 Add endpoint error handling
    - Wrap in try-catch
    - Return 400 for validation errors
    - Return 500 for Claude API failures
    - Return user-friendly error messages
    - File: `/server/routes/triage.js`
  - [ ] 3.9 Mount router in main server
    - Import triage router
    - app.use('/api/triage', triageRouter)
    - File: `/server/index.js`
  - [ ] 3.10 Test Claude integration manually
    - Use Postman/Thunder Client
    - Send sample symptom request
    - Verify structured JSON response
    - Test error scenarios

**Acceptance Criteria:**
- Claude API called successfully
- Response contains all required JSON fields
- Image analysis works when provided
- Appropriate error messages for failures
- API key never exposed in responses

---

### Frontend Foundation

#### Task Group 4: React App Structure
**Dependencies:** Task Group 1
**Estimated Time:** 20 minutes

- [ ] 4.0 Complete React application foundation
  - [ ] 4.1 Clean up default Vite template
    - Remove default App.css content
    - Remove default App.jsx content
    - Keep index.css with Tailwind directives
    - File: `/client/src/App.jsx`, `/client/src/App.css`
  - [ ] 4.2 Create base App.jsx layout structure
    - Import useState, useEffect from React
    - Define state: location, analysisResult, selectedFacility, isLoading, error
    - Create main layout container with CSS Grid
    - Three-column layout: 30% | 35% | 35%
    - File: `/client/src/App.jsx`
  - [ ] 4.3 Add responsive breakpoints
    - Desktop: grid-cols-[30%_35%_35%]
    - Mobile: stack vertically (grid-cols-1)
    - Use Tailwind responsive prefixes (md:, lg:)
    - File: `/client/src/App.jsx`
  - [ ] 4.4 Create fixed header component
    - App name: "CareCompass AI"
    - Tagline: "Find the right care, right now"
    - Professional styling with Tailwind
    - File: `/client/src/App.jsx`
  - [ ] 4.5 Add medical disclaimer footer
    - "This is not medical advice. Always seek professional medical help for serious symptoms."
    - Privacy notice: "Your symptoms are analyzed in real-time and not stored"
    - Fixed at bottom or in footer section
    - File: `/client/src/App.jsx`
  - [ ] 4.6 Create API utility module
    - Import axios or use fetch
    - Set baseURL from VITE_API_URL env variable
    - Export analyzeSymptoms function
    - Handle request/response formatting
    - File: `/client/src/utils/api.js`
  - [ ] 4.7 Create placeholder component files
    - InputPanel.jsx with basic export
    - ResultPanel.jsx with basic export
    - MapPanel.jsx with basic export
    - Files: `/client/src/components/InputPanel.jsx`, `/client/src/components/ResultPanel.jsx`, `/client/src/components/MapPanel.jsx`
  - [ ] 4.8 Import and render placeholder components
    - Import all three panel components
    - Render in grid layout
    - Pass necessary props (state and handlers)
    - File: `/client/src/App.jsx`

**Acceptance Criteria:**
- App renders without errors
- Three-column layout visible on desktop
- Stacks vertically on mobile
- Header and footer display correctly
- API utility configured

---

### Input Panel Development

#### Task Group 5: User Input Form
**Dependencies:** Task Group 4
**Estimated Time:** 25 minutes

- [ ] 5.0 Complete input panel with all form fields
  - [ ] 5.1 Set up React Hook Form
    - Import useForm from react-hook-form
    - Destructure register, handleSubmit, formState, setValue
    - Configure default values
    - File: `/client/src/components/InputPanel.jsx`
  - [ ] 5.2 Create location input field
    - Text input for city/location
    - Placeholder: "Enter your city or address"
    - Required field validation
    - Label with proper accessibility
    - File: `/client/src/components/InputPanel.jsx`
  - [ ] 5.3 Add geolocation auto-detect button
    - Button next to location input
    - Use navigator.geolocation.getCurrentPosition()
    - On success: reverse geocode to city name (or use coordinates)
    - On error: show "Location access denied" message
    - Update form value with setValue()
    - File: `/client/src/components/InputPanel.jsx`
  - [ ] 5.4 Create symptom textarea
    - Multi-line textarea
    - Placeholder: "Describe what's going on..."
    - Required field validation
    - Min 10 characters
    - Generous height (rows=6)
    - File: `/client/src/components/InputPanel.jsx`
  - [ ] 5.5 Implement image upload field
    - File input accepting image/jpeg, image/png
    - Max size: 5MB validation
    - Preview uploaded image thumbnail
    - Optional field (not required)
    - File: `/client/src/components/InputPanel.jsx`
  - [ ] 5.6 Convert image to base64 for API
    - Use FileReader API
    - Read as Data URL
    - Extract base64 portion
    - Resize to max 1024px width using canvas
    - Store in form state
    - File: `/client/src/components/InputPanel.jsx`
  - [ ] 5.7 Create insurance status radio group
    - Three options: "Good insurance", "High deductible / unsure", "No insurance"
    - Radio button group with proper labels
    - Required selection
    - Default to middle option
    - File: `/client/src/components/InputPanel.jsx`
  - [ ] 5.8 Build submit button with loading state
    - Disabled during API processing (isLoading prop)
    - Show loading spinner when disabled
    - Text: "Analyze Symptoms" -> "Analyzing..."
    - Full width, prominent styling
    - File: `/client/src/components/InputPanel.jsx`
  - [ ] 5.9 Implement form submission handler
    - Receive onSubmit prop from parent
    - Validate all fields
    - Construct payload: { symptoms, image, location, insuranceStatus }
    - Call parent handler
    - Display inline validation errors
    - File: `/client/src/components/InputPanel.jsx`
  - [ ] 5.10 Style input panel with Tailwind
    - Card container with shadow-md
    - Consistent padding (p-6)
    - Form field spacing (space-y-4)
    - Focus states for inputs
    - Error message styling (text-red-500)
    - File: `/client/src/components/InputPanel.jsx`

**Acceptance Criteria:**
- All form fields render correctly
- Validation prevents empty submissions
- Image upload shows preview and converts to base64
- Geolocation button works (with fallback)
- Loading state disables form during submission
- Form data passed to parent correctly

---

### Results Display

#### Task Group 6: AI Response Visualization
**Dependencies:** Task Group 4
**Estimated Time:** 25 minutes

- [ ] 6.0 Complete results panel with all display sections
  - [ ] 6.1 Create UrgencyBadge component
    - Accept urgencyLevel and urgencyColor props
    - Map colors: green -> bg-green-500, yellow -> bg-yellow-500, red -> bg-red-500
    - Large, prominent badge styling
    - Display urgency level text
    - File: `/client/src/components/UrgencyBadge.jsx`
  - [ ] 6.2 Build LoadingSpinner component
    - Animated spinner using Tailwind
    - animate-spin class
    - Centered in container
    - File: `/client/src/components/LoadingSpinner.jsx`
  - [ ] 6.3 Set up ResultPanel structure
    - Receive analysisResult and isLoading props
    - Show loading spinner when isLoading
    - Show "Submit symptoms to see recommendations" when no result
    - Show results when analysisResult exists
    - File: `/client/src/components/ResultPanel.jsx`
  - [ ] 6.4 Display urgency badge and care type
    - Render UrgencyBadge at top
    - Bold heading with recommended_care_type
    - Large, clear typography
    - File: `/client/src/components/ResultPanel.jsx`
  - [ ] 6.5 Show reasoning summary card
    - Card with reasoning_summary text
    - Appropriate icon (info icon)
    - Clear, readable text
    - File: `/client/src/components/ResultPanel.jsx`
  - [ ] 6.6 Implement red flags warning section
    - Only display if red_flags array is non-empty
    - Warning icon and red/orange styling
    - List each flag as bullet point
    - Prominent visual treatment
    - File: `/client/src/components/ResultPanel.jsx`
  - [ ] 6.7 Create financial guidance card
    - Display financial_category as header
    - Show financial_explanation as body text
    - Dollar sign or money icon
    - Card styling consistent with other sections
    - File: `/client/src/components/ResultPanel.jsx`
  - [ ] 6.8 Build doctor summary box with copy button
    - Display doctor_summary text
    - Copy-to-clipboard button using navigator.clipboard.writeText()
    - Show "Copied!" feedback after successful copy
    - Bordered box distinguishing it from other content
    - File: `/client/src/components/ResultPanel.jsx`
  - [ ] 6.9 Add smooth fade-in animation
    - Use Tailwind transition utilities
    - opacity-0 -> opacity-100 on mount
    - transition-opacity duration-500
    - File: `/client/src/components/ResultPanel.jsx`
  - [ ] 6.10 Style results panel with Tailwind
    - Scrollable container if content overflow
    - Card-based sections with shadow-md
    - Consistent spacing (space-y-6)
    - Professional medical aesthetic
    - File: `/client/src/components/ResultPanel.jsx`

**Acceptance Criteria:**
- Loading spinner shows during analysis
- Urgency badge displays correct color
- All result sections render with data
- Red flags only shown when present
- Copy button works for doctor summary
- Smooth transitions on result load

---

### Map Integration

#### Task Group 7: Google Maps and Facilities
**Dependencies:** Task Group 4
**Estimated Time:** 30 minutes

- [ ] 7.0 Complete map panel with facility markers
  - [ ] 7.1 Create hardcoded facility data
    - 9-12 sample facilities for San Francisco
    - Data structure: { id, name, type, lat, lng, address, phone }
    - Types: clinic, urgent_care, hospital
    - Realistic coordinates within SF area
    - File: `/client/src/data/facilities.js`
  - [ ] 7.2 Set up Google Maps loader
    - Import useLoadScript from @react-google-maps/api
    - Load with API key from VITE_GOOGLE_MAPS_API_KEY
    - Handle loading and error states
    - File: `/client/src/components/MapPanel.jsx`
  - [ ] 7.3 Create Google Map container
    - Import GoogleMap from @react-google-maps/api
    - Set container size: min-height 400px, full width
    - Center on default location (San Francisco)
    - Set zoom level (12-14 for city view)
    - File: `/client/src/components/MapPanel.jsx`
  - [ ] 7.4 Implement location geocoding
    - Convert user's city/location to lat/lng
    - Use Google Geocoding API or simple lookup
    - Update map center when location changes
    - File: `/client/src/components/MapPanel.jsx`
  - [ ] 7.5 Add facility markers to map
    - Import Marker from @react-google-maps/api
    - Map over filtered facilities
    - Position markers at facility coordinates
    - File: `/client/src/components/MapPanel.jsx`
  - [ ] 7.6 Color-code markers by facility type
    - Green markers for clinics
    - Yellow markers for urgent_care
    - Red markers for hospitals
    - Use custom marker icons or label colors
    - File: `/client/src/components/MapPanel.jsx`
  - [ ] 7.7 Add InfoWindow on marker click
    - Import InfoWindow from @react-google-maps/api
    - Show facility name and address on click
    - Track selected marker in state
    - Close on click outside or X button
    - File: `/client/src/components/MapPanel.jsx`
  - [ ] 7.8 Filter facilities based on AI recommendation
    - Receive analysisResult prop
    - Filter by recommended care type
    - Or use suggested_search_queries to match facility types
    - Show all facilities if no filter active
    - File: `/client/src/components/MapPanel.jsx`
  - [ ] 7.9 Calculate distance from user location
    - Implement Haversine formula for distance
    - Accept user lat/lng and facility lat/lng
    - Return distance in miles
    - File: `/client/src/utils/distance.js`
  - [ ] 7.10 Build facility list below map
    - List matching facilities
    - Show name, type, address, distance
    - Sort by distance from user
    - Clickable rows
    - File: `/client/src/components/MapPanel.jsx`
  - [ ] 7.11 Generate Google Maps navigation links
    - Format: https://www.google.com/maps/dir/?api=1&destination={address}
    - URL encode address properly
    - Open in new tab on click
    - Button or link styling
    - File: `/client/src/components/MapPanel.jsx`
  - [ ] 7.12 Style map panel with Tailwind
    - Sticky positioning on desktop
    - Full height utilization
    - Clean facility list styling
    - Responsive container
    - File: `/client/src/components/MapPanel.jsx`

**Acceptance Criteria:**
- Google Map loads without errors
- Markers display at correct locations
- Markers color-coded by facility type
- InfoWindow shows on marker click
- Facilities filtered by recommendation
- Distance calculated and displayed
- Navigation links open Google Maps

---

### End-to-End Integration

#### Task Group 8: Complete Flow Connection
**Dependencies:** Task Groups 3, 5, 6, 7
**Estimated Time:** 20 minutes

- [ ] 8.0 Complete end-to-end integration
  - [ ] 8.1 Wire up form submission to API
    - In App.jsx, create handleAnalyze function
    - Call API utility's analyzeSymptoms
    - Pass form data as payload
    - Set isLoading to true before call
    - File: `/client/src/App.jsx`
  - [ ] 8.2 Handle successful API response
    - Set analysisResult state with response data
    - Set isLoading to false
    - Clear any previous errors
    - File: `/client/src/App.jsx`
  - [ ] 8.3 Handle API errors gracefully
    - Set error state with user-friendly message
    - Set isLoading to false
    - Display error in UI (toast or alert)
    - File: `/client/src/App.jsx`
  - [ ] 8.4 Update location state from form
    - Extract location from form submission
    - Update location state in App.jsx
    - Trigger map re-center via prop change
    - File: `/client/src/App.jsx`
  - [ ] 8.5 Pass all necessary props to components
    - InputPanel: onSubmit handler, isLoading
    - ResultPanel: analysisResult, isLoading
    - MapPanel: location, analysisResult, facilities
    - File: `/client/src/App.jsx`
  - [ ] 8.6 Add global error display
    - Show error messages prominently
    - Retry button to clear error
    - Red styling for error state
    - File: `/client/src/App.jsx`
  - [ ] 8.7 Configure backend CORS for frontend
    - Set CORS origin to frontend URL (localhost:5173 for Vite)
    - Allow necessary headers
    - File: `/server/index.js`
  - [ ] 8.8 Test complete flow manually
    - Submit sample symptoms
    - Verify Claude API called
    - Check results display correctly
    - Confirm map updates with facilities
    - Test navigation links work

**Acceptance Criteria:**
- Form submission triggers API call
- API response populates result panel
- Map filters facilities based on recommendation
- Error states handled and displayed
- Loading states smooth throughout flow
- No console errors in browser

---

### Final Polish and Demo Prep

#### Task Group 9: Demo Readiness
**Dependencies:** Task Group 8
**Estimated Time:** 20 minutes

- [ ] 9.0 Complete demo polish and testing
  - [ ] 9.1 Create sample test scenarios
    - Minor symptoms (headache, cold) -> self_care/clinic
    - Moderate symptoms (persistent fever) -> urgent_care
    - Severe symptoms (chest pain) -> er
    - Document expected behaviors
    - File: `/demo-scenarios.md` or internal notes
  - [ ] 9.2 Test each urgency level path
    - Verify green/yellow/red badge displays
    - Check financial guidance varies by insurance
    - Confirm appropriate facilities highlighted
    - File: Manual testing
  - [ ] 9.3 Add loading state polish
    - Skeleton screens or placeholders
    - Smooth transitions between states
    - No jarring UI shifts
    - Files: Various component files
  - [ ] 9.4 Verify mobile responsiveness
    - Test at 375px width (iPhone SE)
    - Ensure form is usable on mobile
    - Map scrollable and functional
    - Results readable without horizontal scroll
    - File: Manual testing on mobile viewport
  - [ ] 9.5 Add fallback for API failures
    - Prepare static mock response for demo backup
    - Toggle to use mock if API fails
    - Ensure demo can continue regardless
    - File: `/client/src/utils/mockData.js`
  - [ ] 9.6 Clean up console logs
    - Remove debugging statements
    - Keep only essential error logs
    - Clean browser console for demo
    - Files: All JavaScript files
  - [ ] 9.7 Verify all environment variables set
    - ANTHROPIC_API_KEY in server/.env
    - VITE_GOOGLE_MAPS_API_KEY in client/.env
    - VITE_API_URL pointing to backend
    - File: Environment configuration
  - [ ] 9.8 Test geolocation permission flow
    - Prompt appears correctly
    - Denial shows fallback message
    - Acceptance populates location field
    - File: Manual testing
  - [ ] 9.9 Verify copy-to-clipboard functionality
    - Doctor summary copies correctly
    - Visual feedback on copy
    - Works across browsers
    - File: Manual testing
  - [ ] 9.10 Final visual consistency check
    - Colors match design (green #10B981, yellow #F59E0B, red #EF4444)
    - Consistent spacing and typography
    - Professional appearance
    - File: Visual inspection

**Acceptance Criteria:**
- All three urgency paths tested and working
- Mobile layout functional and readable
- No errors in browser console
- API keys configured and working
- Demo can run even if external APIs fail
- Professional, polished appearance

---

## Execution Order

**Recommended implementation sequence for 3-hour hackathon:**

1. **Project Setup** (Task Group 1) - 20 min
   - Critical foundation, do first

2. **Backend Foundation** (Task Group 2) - 15 min
   - Server must exist before Claude integration

3. **Claude AI Integration** (Task Group 3) - 25 min
   - Core intelligence of the app
   - Can test independently with Postman

4. **Frontend Foundation** (Task Group 4) - 20 min
   - Layout structure for components

5. **Input Panel** (Task Group 5) - 25 min
   - User entry point
   - Can work on parallelly with Results if splitting work

6. **Results Display** (Task Group 6) - 25 min
   - Shows AI output
   - High visual impact for demo

7. **Map Integration** (Task Group 7) - 30 min
   - Complex but impressive feature
   - Start after Results if time-constrained

8. **End-to-End Integration** (Task Group 8) - 20 min
   - Connect all pieces
   - Critical for working demo

9. **Final Polish** (Task Group 9) - 20 min
   - Demo prep and testing
   - Skip if time runs short (core flow more important)

**Total Estimated Time:** 3 hours 20 minutes

**Time-Saving Tips:**
- If running behind, simplify map to static markers (skip filtering)
- Use placeholder image instead of actual upload if needed
- Mock Claude response for faster frontend development
- Focus on one urgency path working perfectly vs. all three partially

---

## Critical Path Items (Must Complete for Demo)

1. Server running with Claude API endpoint
2. Frontend form collecting symptoms and insurance
3. Claude returning structured JSON response
4. Results displaying urgency badge and recommendations
5. Map showing relevant facilities

**Nice-to-Have (Skip if Time-Constrained):**
- Image upload functionality
- Geolocation auto-detect
- Distance calculations
- InfoWindow popups
- Fade-in animations
- Copy-to-clipboard button
