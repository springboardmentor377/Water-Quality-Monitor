# Water Quality Monitor - Milestone 4 Documentation

## Overview
This document covers the implementation details for Milestone 4 of the Water Quality Monitor project, focusing on NGO collaboration tools and advanced dashboard analytics.

## Table of Contents
1. [User Roles](#user-roles)
2. [NGO Collaboration Tools](#ngo-collaboration-tools)
3. [Dashboard Analytics](#dashboard-analytics)
4. [API Endpoints](#api-endpoints)
5. [Database Schema Changes](#database-schema-changes)
6. [Frontend Components](#frontend-components)
7. [Caching Implementation](#caching-implementation)
8. [Installation and Setup](#installation-and-setup)

## User Roles
The system supports four distinct user roles with specific permissions:

- **citizen**: Can submit reports and view public information
- **ngo**: Can manage NGO projects and view analytics
- **authority**: Can review reports and manage alerts
- **admin**: Full system access and management capabilities

## NGO Collaboration Tools

### Features
- NGO users can publish water quality projects
- NGOs can view their own projects
- Project management with status tracking
- Contact information for collaboration

### API Endpoints

#### POST /ngo-projects/
Creates a new NGO project.

**Request:**
```
POST /ngo-projects/
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "project_name": "string",
  "contact_email": "string",
  "description": "string",
  "start_date": "datetime",
  "end_date": "datetime"
}
```

**Response:**
```json
{
  "id": 1,
  "ngo_name": "string",
  "project_name": "string",
  "contact_email": "string",
  "description": "string",
  "start_date": "datetime",
  "end_date": "datetime",
  "status": "string",
  "created_at": "datetime"
}
```

**Requirements:**
- User must have NGO or admin role
- Returns 403 Forbidden if user is not an NGO

#### GET /ngo-projects/
Retrieves all projects belonging to the current NGO user.

**Request:**
```
GET /ngo-projects/
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "ngo_name": "string",
    "project_name": "string",
    "contact_email": "string",
    "description": "string",
    "start_date": "datetime",
    "end_date": "datetime",
    "status": "string",
    "created_at": "datetime"
  }
]
```

**Requirements:**
- User must have NGO or admin role
- Returns only projects associated with the authenticated user
- Returns 403 Forbidden if user is not an NGO

## Dashboard Analytics

### Number Cards
The dashboard displays the following metrics:

- **Total Waterstations**: Total number of monitoring stations
- **Total Readings Collected**: Total number of water quality readings
- **Avg Readings Per Station**: Average readings per station
- **Avg Reports Per Station**: Average reports per station

### Charts
- **Pie Chart**: Alert status distribution
- **Pie Chart**: Report status distribution
- **Box Plot**: Parameter statistics visualization
- **Latest Alerts**: Shows last 3 alerts with details
- **Latest Reports**: Shows last 3 reports with details

#### GET /dashboard/data
Returns comprehensive dashboard metrics with caching.

**Request:**
```
GET /dashboard/data
```

**Response:**
```json
{
  "tws": 10,
  "trc": 150,
  "arps": 15.0,
  "areps": 2.5,
  "asc": {
    "contamination": 3,
    "boil_notice": 1
  },
  "rsc": {
    "pending": 5,
    "verified": 8,
    "rejected": 2
  },
  "latest_alerts": [
    {
      "id": 1,
      "type": "contamination",
      "message": "string",
      "location": "string",
      "issued_at": "datetime"
    }
  ],
  "latest_reports": [
    {
      "id": 1,
      "location": "string",
      "description": "string",
      "water_source": "string",
      "status": "string",
      "created_at": "datetime"
    }
  ]
}
```

## API Endpoints

### Collaboration Endpoints (Updated)
The original `/collaborations/` endpoints have been enhanced with role-based access control:

- **GET /collaborations/**: Retrieve all collaborations (NGO/admin only)
- **POST /collaborations/**: Create collaboration (NGO/admin only)
- **GET /collaborations/{id}**: Get specific collaboration
- **PUT /collaborations/{id}**: Update collaboration
- **DELETE /collaborations/{id}**: Delete collaboration

### Predictive Alerts
- **GET /predictive-alerts/**: Retrieve predictive alerts
- **POST /predictive-alerts/**: Create predictive alert
- **POST /predictive-alerts/generate**: Generate predictions based on trends

## Database Schema Changes

### Updated Collaboration Model
```sql
CREATE TABLE collaboration (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,  -- Foreign key to User table
    project_name VARCHAR NOT NULL,
    contact_email VARCHAR NOT NULL,
    description TEXT,
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME,
    status VARCHAR DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Changes from previous version:**
- Replaced `ngo_name` field with `user_id` (foreign key to User table)
- Now associates projects with specific users rather than storing NGO name as string
- Maintains relationship to user accounts for proper access control

### New Tables
- **PredictiveAlert**: Stores predictive analytics results
- **Collaboration**: Manages NGO project collaborations

## Frontend Components

### New Pages
- **NGOProjects.jsx**: Dedicated page for NGO project management
- **Enhanced Dashboard**: Updated with charts and analytics
- **NGODashboard.jsx**: NGO-specific dashboard (existing)

### Navigation Updates
- Added "My Projects" link to navbar for NGO users
- Conditional rendering based on user role

### Dashboard Enhancements
- Implemented number cards with new metrics
- Added chart visualizations (simulated with CSS)
- Included latest alerts and reports sections

## Caching Implementation

### Dashboard Data Caching
- **Technology**: aiocache
- **TTL**: 300 seconds (5 minutes)
- **Endpoint**: `/dashboard/data`
- **Benefits**: Improved performance for frequently accessed metrics

## Installation and Setup

### Backend Dependencies
```bash
pip install -r requirements.txt
```

New dependency added:
- `aiocache` - For caching dashboard data

### Database Initialization
1. Delete existing database: `del water_quality.db`
2. Run initialization: `python init_db.py`

### Running the Application
1. **Backend**: `uvicorn app.main:app --reload`
2. **Frontend**: `npm run dev`

### Testing Credentials
- Citizen: citizen@gmail.com / 1234
- Authority: authority@gmail.com / 1234
- Admin: admin@gmail.com / 1234
- NGO: ngo@gmail.com / 1234

## Security Features
- Role-based access control for all endpoints
- JWT authentication required for protected routes
- Validation that only NGO users can create/view projects
- Proper foreign key relationships to enforce data integrity

## Troubleshooting
- If database errors occur, delete `water_quality.db` and rerun `init_db.py`
- Ensure both backend and frontend servers are running
- Check that user has appropriate role for accessing features