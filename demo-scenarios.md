# CareCompass AI Demo Scenarios

## Purpose
This document outlines test scenarios for demonstrating the CareCompass AI MVP. Each scenario maps to a specific urgency level and care recommendation.

---

## Scenario 1: Minor Symptoms - SELF CARE / CLINIC
**Expected Urgency Level:** `self_care` or `clinic`
**Expected Badge Color:** GREEN

### Input
- **Location:** San Francisco
- **Symptoms:** "I've had a mild headache for the past day. No other symptoms, just a dull ache behind my eyes. I'm well hydrated and got enough sleep."
- **Insurance Status:** Good insurance

### Expected Behavior
- Green urgency badge displayed
- Recommended care type: Self-care at home or Primary care clinic
- Reasoning mentions rest, hydration, OTC pain relief
- Financial guidance suggests low cost options
- Map highlights: Clinics (green markers)
- No red flags section

---

## Scenario 2: Moderate Symptoms - URGENT CARE
**Expected Urgency Level:** `urgent_care`
**Expected Badge Color:** YELLOW

### Input
- **Location:** San Francisco
- **Symptoms:** "I've had a persistent fever of 102F for the past 3 days. It goes down with ibuprofen but comes back. I also have body aches and fatigue. No cough or breathing issues."
- **Insurance Status:** High deductible / unsure

### Expected Behavior
- Yellow urgency badge displayed
- Recommended care type: Urgent Care Center
- Reasoning mentions prolonged fever evaluation, rule out infection
- Financial guidance mentions moderate costs, sliding scale options
- Map highlights: Urgent Care facilities (yellow markers)
- May show red flags about fever duration

---

## Scenario 3: Severe Symptoms - EMERGENCY ROOM
**Expected Urgency Level:** `er`
**Expected Badge Color:** RED

### Input
- **Location:** San Francisco
- **Symptoms:** "I'm having severe chest pain that started 30 minutes ago. It feels like pressure in the center of my chest. Pain is radiating to my left arm. I'm also feeling short of breath and nauseous."
- **Insurance Status:** No insurance

### Expected Behavior
- RED urgency badge displayed (critical)
- Recommended care type: Emergency Room / CALL 911
- Reasoning emphasizes immediate cardiac evaluation needed
- Strong warning about potential heart attack
- Red flags section prominently displayed with multiple warnings
- Financial guidance mentions ER costs but emphasizes life-saving priority
- Map highlights: Hospitals (red markers)

---

## Additional Test Scenarios

### Scenario 4: Skin Condition with Image
**Expected Urgency Level:** `clinic` or `urgent_care`

### Input
- **Location:** San Francisco
- **Symptoms:** "I noticed a rash on my arm that appeared yesterday. It's red, slightly raised, and itchy. No fever or other symptoms."
- **Insurance Status:** Good insurance
- **Image:** Upload photo of rash (if available)

### Expected Behavior
- Green or Yellow badge (depends on severity)
- Recommends clinic visit for evaluation
- Doctor summary useful for dermatology consult
- Test copy-to-clipboard functionality

---

## Verification Checklist

### Visual Elements
- [ ] Urgency badges display correct colors (green/yellow/red)
- [ ] Color hex values match spec: #10B981 (green), #F59E0B (yellow), #EF4444 (red)
- [ ] Typography is clear and readable
- [ ] Spacing is consistent across all cards
- [ ] Icons render correctly (info, warning, dollar sign)

### Functionality
- [ ] Form validation works (required fields)
- [ ] Loading spinner appears during analysis
- [ ] Results fade in smoothly
- [ ] Copy button shows "Copied!" feedback
- [ ] Geolocation button works
- [ ] Map markers are clickable
- [ ] Navigation links open in new tab
- [ ] Facilities filter based on recommendation

### Mobile Testing (375px width)
- [ ] Form is usable on mobile
- [ ] Results are readable without horizontal scroll
- [ ] Map is scrollable and interactive
- [ ] Buttons are tap-friendly (adequate size)

### Error Handling
- [ ] API error shows user-friendly message
- [ ] Rate limit message displayed correctly
- [ ] Network error handled gracefully
- [ ] Mock data fallback works when needed

---

## Financial Guidance Variations

### Good Insurance
- Lower cost emphasis
- Mention of coverage
- Copay expectations

### High Deductible/Unsure
- Cost awareness
- Sliding scale options
- Urgent care vs ER cost comparison

### No Insurance
- Community health centers
- Free clinics
- Payment plan options
- Emergency financial assistance

---

## Demo Flow Recommendation

1. **Start with Minor Symptoms** (Green path)
   - Shows baseline functionality
   - Quick response
   - Demonstrates cost-effective guidance

2. **Progress to Moderate Symptoms** (Yellow path)
   - Shows escalation logic
   - Different facility recommendations
   - Financial considerations

3. **End with Emergency Scenario** (Red path)
   - Most impactful demo moment
   - Shows critical care detection
   - Emphasizes life-saving potential

4. **Optional: Show Image Upload**
   - Demonstrates multimodal AI capability
   - Visual symptom assessment

---

## Known Limitations for Demo

1. Facility data is hardcoded for San Francisco area
2. Distance calculations assume San Francisco coordinates
3. Google Maps API key required for full functionality
4. Mock data available as backup if API fails
5. Not actual medical advice - educational/navigational only
