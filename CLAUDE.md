# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OmniDent AI - A comprehensive dental practice management system built with React and Material-UI. This is a healthcare CRM focused on patient management, appointment scheduling, and practice operations.

## Development Commands

```bash
# Start development server on port 3000
npm start

# Build for production
npm build

# Run tests with Vitest
npm test

# Preview production build
npm preview
```

## Architecture & Key Design Patterns

### Tech Stack
- **React 18.2** with functional components and hooks
- **Material-UI 7.3** for UI components
- **React Router DOM 7.8** for routing
- **Recharts** for data visualization and analytics
- **Vite** as build tool
- **Emotion** for CSS-in-JS styling
- **Plus Jakarta Sans** as primary font

### Color Scheme
- Primary: Navy Blue (#0B1929)
- Secondary: Mint Green (#3EE4C8)
- Light backgrounds with gradient overlays
- Professional healthcare aesthetic

### Component Structure

The application follows a modular component architecture:

1. **Authentication Flow**: 
   - `Login.jsx` and `Signup.jsx` handle user authentication
   - LocalStorage used for session management (development only)
   - Session tracking with unique IDs

2. **Dashboard Layout**:
   - `Dashboard.jsx` is the main container with sidebar navigation
   - Sidebar-only navigation (no duplicate tabs in content area)
   - Six main sections: Overview, Customers, Forms, Reports, Practice Enhancer, Settings

3. **State Management**:
   - Component-level state with useState
   - Authentication state managed in App.jsx
   - Session data persisted in localStorage

### Routing Structure

```javascript
/ → Redirects to /dashboard or /login based on auth
/login → Login page
/signup → Registration page  
/dashboard → Main application (protected route)
```

### Styling Conventions

- Use Material-UI's `sx` prop for component styling
- Gradient backgrounds for visual depth
- Hover states with smooth transitions (0.3s ease)
- Border radius of 2 for cards and buttons
- Consistent spacing using MUI theme units

### Data Storage (Current)

Using localStorage for:
- User accounts (`users`)
- Session history (`sessions`)
- Current user state (`currentUser`)

**Note**: This is for development only. Production will require backend API integration.

## Component Communication Patterns

- Props drilling for authentication state
- Event handlers passed as props (onLogin, onLogout)
- Direct localStorage access for data persistence
- Selected tab state managed with index-based system

## Key Implementation Details

### Dashboard Navigation
- `selectedIndex` state tracks active section
- Conditional rendering based on selectedIndex
- Icons imported from @mui/icons-material
- Light sidebar with mint accent for selected items

### Form Validation
- Email format validation
- Password minimum length (6 characters)
- Password confirmation matching
- Duplicate email prevention on signup

### Session Management
- Unique session IDs generated with Date.now()
- Login timestamps stored in ISO format
- Current session highlighted in history
- Clear history functionality (preserves current session)

## Current Features

### Overview Dashboard
- **Metric Cards**: Total Revenue, Total Bookings, Total Conversations, Most Recent Booking
- **Analytics Charts**:
  - Monthly Revenue Trends (Area chart with target line)
  - Weekly Bookings (Bar chart with cancellations)
  - Appointment Types (Bar chart showing count and revenue)
  - Conversations by Channel (Bar chart)
  - Most Popular Procedures (Bar chart)
  - Insurance Verifications (Bar chart for Delta, Aetna, Cigna, Blue Cross, MetLife, United)
  - Appointment Types by Gender (Grouped bar chart)
  - Patient Types (Pie chart - New vs Returning)
  - Total Revenue by Appointment Type (Pie chart)
  - OmniDent AI Patient Satisfaction Metrics (Radar/Spider chart)

### Customers Section
- **Patient List Sidebar**:
  - Avatar circles with patient initials
  - Patient names and last message preview
  - Time stamps and unread message counts
  - Search functionality
- **Chat Interface**:
  - Full conversation history with timestamps
  - Channel indicators per message (SMS, Call, Webchat)
  - File attachment button in reply box
  - Channel filtering with custom animated checkboxes
  - Date separators in conversation view
- **Multi-Channel Support**: Messages can come from SMS, Call, or Webchat channels

### Reports Section
- **Report Cards**: Financial Reports, Patient Reports, Insurance Analysis, Operational Metrics
- Cards styled with gradient backgrounds, mint green icons, and hover effects

### Practice Enhancer Section
- **AI Chat Interface**:
  - Interactive chat with OmniDent AI assistant
  - Knows everything about practice data and metrics
  - Provides insights on revenue, patient retention, appointments, insurance, and marketing
  - Smart contextual responses based on query topics
  - User messages styled in navy, AI responses in white with mint border
  - Rounded message bubbles with timestamps
  - Real-time typing and response simulation

### Custom Components
- `CustomCheckbox.jsx` - Animated checkbox with SVG checkmark
- `PatientList.jsx` - Patient sidebar with search and selection
- `ChatInterface.jsx` - Complete messaging interface
- `PracticeEnhancerChat.jsx` - AI chat interface for practice insights
- `SessionHistory.jsx` - Login session tracking

## Future Development Notes

Backend integration will require:
- JWT authentication replacement
- PostgreSQL database setup
- API endpoints for all CRUD operations
- HIPAA compliance measures
- Real-time message updates
- File upload/download functionality

## Testing Approach

Currently using Vitest for testing. Test files should follow the pattern `*.test.js` or `*.test.jsx`.

## Important Files

- `src/theme.js` - Material-UI theme configuration
- `src/App.jsx` - Main app component with routing
- `src/components/Dashboard.jsx` - Core dashboard layout with charts and analytics
- `src/components/PatientList.jsx` - Patient sidebar component
- `src/components/ChatInterface.jsx` - Messaging interface component
- `src/components/PracticeEnhancerChat.jsx` - AI chat interface for practice insights
- `src/components/CustomCheckbox.jsx` - Custom animated checkbox component
- `src/components/SessionHistory.jsx` - Session tracking component
- `PROJECT.md` - Comprehensive project documentation
- `src/index.css` - Global styles and gradients