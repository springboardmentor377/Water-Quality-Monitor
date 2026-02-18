# Water Quality Monitor - Frontend Milestone 4 Documentation

## Overview
This document covers the frontend implementation details for Milestone 4 of the Water Quality Monitor project, focusing on NGO collaboration tools and enhanced dashboard analytics.

## Table of Contents
1. [Component Structure](#component-structure)
2. [New Pages](#new-pages)
3. [Route Protection](#route-protection)
4. [Dashboard Enhancements](#dashboard-enhancements)
5. [API Integration](#api-integration)
6. [State Management](#state-management)
7. [UI/UX Improvements](#uiux-improvements)

## Component Structure

### Shared Components
- **Navbar.jsx**: Updated with conditional NGO project link
- **ProtectedRoute.jsx**: Maintains existing role-based protection

### Page Components
- **NGOProjects.jsx**: New page for NGO project management
- **NGODashboard.jsx**: Existing NGO dashboard page
- **Dashboard.jsx**: Enhanced with analytics and charts
- **PredictiveAlerts.jsx**: Existing predictive alerts page

## New Pages

### NGOProjects.jsx
Manages NGO project creation and display for authenticated NGO users.

**Features:**
- Project creation form with validation
- Display of user's projects in card layout
- Toggle form visibility
- Responsive grid layout

**Props:**
- Uses `ProtectedRoute` wrapper
- Integrates with `API` service for data fetching

**State Management:**
- `projects`: Array of NGO projects
- `loading`: Loading state indicator
- `showForm`: Form visibility toggle
- `formData`: Form input values

### Enhanced Dashboard.jsx
Completely redesigned dashboard with analytics and visualizations.

**Sections:**
- Number cards with metrics
- Pie charts for status distributions
- Box plot for parameter statistics
- Latest alerts section
- Latest reports section

## Route Protection

### Protected Routes
All new and existing pages are wrapped with `ProtectedRoute`:

```jsx
<Route path="/ngo-projects" element={
  <ProtectedRoute>
    <NGOProjects />
  </ProtectedRoute>
} />
```

### Conditional Navigation
Navbar includes conditional rendering based on user role:

```jsx
{(userRole === 'ngo' || userRole === 'admin') && (
  <Link to="/ngo-projects">My Projects</Link>
)}
```

## Dashboard Enhancements

### Metrics Displayed
- **Total Waterstations**: From `tws` in API response
- **Total Readings Collected**: From `trc` in API response
- **Avg Readings Per Station**: From `arps` in API response
- **Avg Reports Per Station**: From `areps` in API response

### Chart Visualizations
Implemented using CSS-based bar charts to simulate pie and box plots:

**Pie Chart Simulation:**
- Vertical bars with different heights representing values
- Color-coded segments for different statuses
- Legend for status identification

**Box Plot Simulation:**
- Parameter-based bars showing statistical distribution
- Different colors for different water quality parameters

### Data Fetching
Uses new dashboard API endpoint:
```javascript
API.get('/dashboard/data')
  .then(res => setStats({
    totalStations: res.data.tws,
    totalReadings: res.data.trc,
    avgReadingsPerStation: res.data.arps,
    avgReportsPerStation: res.data.areps,
    alertStatusCount: res.data.asc,
    reportStatusCount: res.data.rsc,
    latestAlerts: res.data.latest_alerts,
    latestReports: res.data.latest_reports
  }))
```

## API Integration

### New Endpoints Used
- **POST /ngo-projects/**: Create new NGO project
- **GET /ngo-projects/**: Fetch user's projects
- **GET /dashboard/data**: Fetch dashboard metrics with caching

### Error Handling
- Proper error messaging for failed API calls
- Role-based access error notifications
- Form submission error handling

### API Service
Uses existing `api.js` with JWT token authorization:
```javascript
const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});
```

## State Management

### Component States
Each component manages its own state:
- Loading indicators
- Form data
- API response data
- UI toggles (form visibility, etc.)

### Data Flow
- Parent components fetch data from API
- State updates trigger UI re-renders
- Form submissions refresh data lists

## UI/UX Improvements

### Responsive Design
- Grid layouts adapt to screen size
- Mobile-friendly navigation
- Consistent spacing and typography

### Visual Feedback
- Hover effects on interactive elements
- Loading states during API calls
- Success/error notifications
- Form validation feedback

### Accessibility
- Semantic HTML structure
- Proper labeling of form elements
- Keyboard navigable components
- Sufficient color contrast

## Styling Approach

### Consistent Theme
- Blue gradient headers (667eea to 764ba2)
- Card-based layout with shadows
- Consistent padding and margins
- Color-coded status indicators

### Interactive Elements
- Button hover effects
- Card hover animations
- Smooth transitions
- Visual feedback for user actions

## Testing Notes

### Manual Testing Checklist
- [ ] NGO users can access `/ngo-projects` route
- [ ] Form submission works for creating projects
- [ ] Project list displays correctly
- [ ] Dashboard metrics load properly
- [ ] Charts render with data
- [ ] Non-NGO users cannot access restricted features
- [ ] Error messages display appropriately
- [ ] Responsive design works on different screen sizes

## Dependencies Used
- **React**: Component framework
- **react-router-dom**: Client-side routing
- **axios**: HTTP client for API calls
- **Existing project dependencies** remain unchanged

## Integration Points
- Works with existing backend API
- Uses same authentication system
- Compatible with existing user roles
- Maintains existing navigation structure