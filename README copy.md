# 💧 Water Quality Monitoring System

A real-time water quality monitoring platform that enables citizens, NGOs, and authorities to track contamination, submit reports, view analytics, and receive predictive alerts.

---

##  Project Overview

This system provides:

- Real-time station monitoring
- Community pollution reporting
- Contamination alerts
- Historical data analytics
- NGO collaboration dashboard
- Predictive risk detection

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Recharts (Analytics)
- Leaflet (Map)

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy
- JWT Authentication

---

##  Authentication

- Role-based login
- JWT token-based authorization

---

## Features

### Module A – User & Report Management
- Register / Login
- Submit water issue reports
- Track report status
- Role-based access

### Module B – Real-Time Water Data & Maps
- Station map view
- Contamination color indicators
- Hover station details

### Module C – Alerts & Collaboration
- Boil notices
- Contamination alerts
- NGO dashboard
- Report verification system

### Module D – Analytics & Predictive Insights
- Historical pH trends
- Turbidity & lead analysis
- Risk classification
- Predictive alert engine

---


##  Database Schema

- Users
- Reports
- WaterStations
- StationReadings
- Alerts
- Collaborations

---

##  How to Run the Project

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload