# Tech Stack

## Overview

CareCompass AI uses the PERN stack (PostgreSQL, Express.js, React, Node.js) with Claude AI for intelligent symptom triage and Google Maps for location-based facility discovery. This stack was chosen for rapid development, strong community support, and suitability for hackathon timeline.

## Frontend

### Core Framework
- **React 18+**: Component-based UI library for building the single-page application
- **Create React App or Vite**: Build tooling and development server (Vite preferred for faster builds)

### UI Components
- **Tailwind CSS**: Utility-first CSS framework for rapid styling and responsive design
- **Headless UI or Radix UI**: Accessible, unstyled component primitives for dropdowns and modals
- **React Icons**: Icon library for urgency badges and UI elements

### Maps Integration
- **@react-google-maps/api**: React wrapper for Google Maps JavaScript API
- **Google Maps JavaScript API**: Core mapping functionality with markers and info windows
- **Google Places API**: Facility search and location autocomplete

### State Management
- **React useState/useReducer**: Built-in hooks for local component state (sufficient for MVP)
- **React Context**: Share global state like location and insurance status across components

### HTTP Client
- **Axios or Fetch API**: HTTP requests to backend API endpoints

### Form Handling
- **React Hook Form**: Lightweight form validation and submission handling
- **Zod**: Schema validation for form inputs (optional for MVP)

## Backend

### Runtime Environment
- **Node.js 18+**: JavaScript runtime for server-side code
- **npm or yarn**: Package management

### Web Framework
- **Express.js 4.x**: Minimal web framework for API routing and middleware
  - `cors`: Cross-origin resource sharing for frontend-backend communication
  - `helmet`: Security headers middleware
  - `express-rate-limit`: Rate limiting for API endpoints
  - `morgan`: HTTP request logging

### API Structure
```
/api
  /triage
    POST /analyze - Submit symptoms, image, location, insurance for AI analysis
  /facilities
    GET /nearby - Fetch healthcare facilities by location and type
  /health
    GET / - Server health check endpoint
```

### File Upload Handling
- **multer**: Multipart form data parsing for image uploads
- **sharp**: Image processing and optimization (resize before sending to Claude)

### Environment Configuration
- **dotenv**: Environment variable management for API keys and configuration

## Database

### Primary Database
- **PostgreSQL 14+**: Relational database for structured data storage

### Schema Considerations (Post-MVP)
```sql
-- Users (Phase 2)
users (id, email, insurance_profile, location_preference, created_at)

-- Symptom History (Phase 2)
symptom_logs (id, user_id, symptoms, image_url, ai_response, timestamp)

-- Facility Cache
facilities (id, place_id, name, type, lat, lng, address, last_updated)

-- Usage Analytics
analytics (id, session_id, input_type, urgency_result, timestamp)
```

### Database Client
- **pg (node-postgres)**: PostgreSQL client for Node.js
- **Knex.js**: SQL query builder and migration management (optional for MVP)

### MVP Approach
- For hackathon: Use in-memory data or JSON files to avoid database setup time
- PostgreSQL integration can be added post-hackathon for persistence

## External APIs

### Claude AI (Anthropic)
- **API Version**: Claude 3.5 Sonnet or Claude 3 Haiku
- **Usage**: Symptom triage, urgency assessment, financial guidance, doctor summaries
- **Integration**: Direct HTTP calls to Anthropic API from backend
- **Key Features Used**:
  - Text analysis for symptom description
  - Vision capabilities for image analysis (rashes, injuries)
  - Structured JSON output for consistent response format

### Claude API Prompt Structure
```javascript
{
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1024,
  messages: [{
    role: "user",
    content: [
      { type: "text", text: systemPrompt + userSymptoms },
      { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } }
    ]
  }]
}
```

### Google Maps Platform
- **Maps JavaScript API**: Interactive map display with custom markers
- **Places API**: Healthcare facility search by type and location
- **Geocoding API**: Convert addresses to coordinates and vice versa
- **Directions API**: Navigation links to facilities (via Google Maps URLs)

### API Keys Management
- Store all API keys in environment variables (never commit to repository)
- Use backend proxy for Claude API calls (protect API key from client)
- Google Maps API key can be restricted by domain and API type

## Development Tools

### Code Quality
- **ESLint**: JavaScript/React linting with Airbnb or Standard style guide
- **Prettier**: Code formatting consistency
- **Husky**: Git hooks for pre-commit linting (optional for hackathon)

### Version Control
- **Git**: Source control
- **GitHub**: Repository hosting and collaboration

### Development Environment
- **VS Code**: Recommended IDE with extensions:
  - ESLint
  - Prettier
  - ES7+ React/Redux/React-Native snippets
  - Thunder Client or REST Client (API testing)

### API Testing
- **Postman or Thunder Client**: Manual API endpoint testing
- **Jest**: Unit testing framework (post-hackathon)
- **React Testing Library**: Component testing (post-hackathon)

## Deployment (Post-Hackathon)

### Frontend Hosting
- **Vercel or Netlify**: Static site hosting with automatic builds from Git
- **Environment variables**: API endpoint URLs and public keys

### Backend Hosting
- **Railway, Render, or Heroku**: Node.js application hosting
- **Environment variables**: Database URLs, API keys, configuration

### Database Hosting
- **Railway PostgreSQL or Supabase**: Managed PostgreSQL instances
- **Connection pooling**: PgBouncer for production scalability

### Domain and SSL
- **Custom domain**: Via hosting provider
- **SSL certificates**: Automatic via hosting platform (Let's Encrypt)

## Security Considerations

### API Security
- Never expose Claude API key to frontend (all AI calls through backend)
- Rate limit API endpoints to prevent abuse
- Validate and sanitize all user inputs
- Use HTTPS for all communications

### Data Privacy
- Do not store symptom data without user consent
- Anonymize analytics data
- Clear disclaimer that service is not medical advice
- HIPAA considerations for future healthcare integrations

### Image Handling
- Validate image file types and sizes
- Process/resize images server-side before AI analysis
- Do not persist medical images without explicit consent

## Hackathon-Specific Considerations

### MVP Shortcuts (Acceptable for 3-Hour Build)
- Skip database setup; use in-memory or static JSON for facility data
- Hardcode facility data for demo location
- Simplified error handling (console logs acceptable)
- No authentication or user accounts
- Basic responsive design (mobile-friendly but not pixel-perfect)

### Demo Readiness
- Prepare sample symptoms and images for demonstration
- Have backup responses if API calls fail during demo
- Clear loading states and visual feedback
- Professional UI even if minimal (Tailwind makes this easy)

### Performance
- Minimize API calls (single Claude call for all recommendations)
- Lazy load map component
- Optimize images before upload to Claude
- Client-side caching of facility data

## File Structure

```
/
├── client/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── InputPanel.jsx
│   │   │   ├── ResultPanel.jsx
│   │   │   ├── MapPanel.jsx
│   │   │   └── UrgencyBadge.jsx
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── index.jsx
│   └── package.json
├── server/                  # Express backend
│   ├── routes/
│   │   ├── triage.js
│   │   └── facilities.js
│   ├── services/
│   │   ├── claude.js
│   │   └── maps.js
│   ├── middleware/
│   ├── index.js
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

This structure separates concerns clearly while remaining simple enough for rapid hackathon development.
