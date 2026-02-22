# 💧 Water Quality Monitor – Milestone 4

## 📌 Milestone 4 Overview

Milestone 4 focuses on:

- NGO Collaboration Module
- Predictive Alert System
- Analytics Dashboard with Charts

This milestone enhances the platform with analytical insights and collaboration capabilities.

---

# 🚀 Features Implemented in Milestone 4

---

## 🌍 1️⃣ NGO Collaboration Module

### Backend
- Created `Collaborations` table
- Added API endpoints:
  - `POST /collaborations`
  - `GET /collaborations`

### Frontend
- NGO Dashboard page
- Form to create collaboration
- List of existing collaboration projects

---

## 🚨 2️⃣ Predictive Alert System

A rule-based alert engine was implemented inside the station readings API.

### How It Works

When a new station reading is added:

- If parameter exceeds threshold
- A contamination alert is automatically generated
- Alert stored in `alerts` table

### Threshold Example

```python
THRESHOLDS = {
    "pH": 8.5,
    "turbidity": 5,
    "DO": 10,
    "lead": 0.01,
    "arsenic": 0.01
}