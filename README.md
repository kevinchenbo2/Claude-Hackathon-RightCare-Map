# CareCompass AI

An AI-powered healthcare navigation app that helps users find the right level of care based on their symptoms, location, and insurance status.

## What It Does

CareCompass AI analyzes your symptoms and recommends the appropriate care level:
- **Self-Care** - Minor issues manageable at home
- **Primary Care Clinic** - Non-urgent conditions for routine doctor visits
- **Urgent Care** - Prompt attention needed but not life-threatening
- **Emergency Room** - Potentially serious or life-threatening symptoms

The app provides:
- AI-powered symptom triage using Claude
- Care level recommendations with reasoning
- Financial guidance based on insurance status
- Interactive map showing nearby facilities
- One-click directions to recommended facilities

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS
- Google Maps API
- Axios

**Backend**
- Node.js + Express
- Anthropic Claude API (claude-sonnet-4)
- Helmet, CORS, Morgan

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/Claude-Hackathon-RightCare-Map.git
cd Claude-Hackathon-RightCare-Map
```

### 2. Set up environment variables

**Server** (`server/.env`):
```
ANTHROPIC_API_KEY=your_anthropic_api_key
PORT=3001
NODE_ENV=development
```

**Client** (`client/.env`):
```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_API_URL=http://localhost:3001
```

### 3. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Run the application
```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

### 5. Open the app
Visit http://localhost:5173

## Usage

1. Enter your symptoms (e.g., "headache and fever for 2 days")
2. Enter your location (e.g., "Nashville" or "East Nashville")
3. Select your insurance type
4. Click "Analyze Symptoms"
5. View AI recommendations and nearby facilities on the map
6. Click "Get Directions" for navigation to any facility

## Important Disclaimers

- This is NOT a diagnostic tool
- Always seek professional medical help for serious symptoms
- In emergencies, call 911 immediately
- Recommendations are for guidance only

## Demo Locations

Currently configured for Nashville, TN area with facilities including:
- Vanderbilt University Medical Center
- TriStar Centennial Medical Center
- Saint Thomas Midtown Hospital
- Various urgent care centers and clinics

## License

MIT
