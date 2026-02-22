#!/usr/bin/env python3
"""
Test script for Water Quality Monitor API
Run this to verify the backend is working correctly.
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_health():
    """Test if server is running"""
    try:
        response = requests.get(f"{BASE_URL}/docs")
        return response.status_code == 200
    except:
        return False

def test_user_registration():
    """Test user registration"""
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpassword123",
        "role": "citizen",
        "location": "Test City"
    }
    
    response = requests.post(f"{BASE_URL}/users/register", json=user_data)
    print(f"Registration: {response.status_code}")
    if response.status_code == 200:
        return response.json()
    return None

def test_user_login():
    """Test user login"""
    login_data = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    response = requests.post(f"{BASE_URL}/users/login", json=login_data)
    print(f"Login: {response.status_code}")
    if response.status_code == 200:
        return response.json()["access_token"]
    return None

def test_get_stations(token):
    """Test getting stations"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/stations/", headers=headers)
    print(f"Get Stations: {response.status_code}")
    return response.status_code == 200

def test_create_report(token):
    """Test creating a report"""
    headers = {"Authorization": f"Bearer {token}"}
    report_data = {
        "description": "Test water pollution report",
        "water_source": "River",
        "latitude": 28.6139,
        "longitude": 77.2090
    }
    
    response = requests.post(f"{BASE_URL}/reports/", json=report_data, headers=headers)
    print(f"Create Report: {response.status_code}")
    return response.status_code == 200

def main():
    """Run all tests"""
    print("🧪 Testing Water Quality Monitor API")
    print("=" * 40)
    
    # Test server health
    print("Testing server connection...")
    if not test_health():
        print("❌ Server is not running. Start it with: python start.py")
        return
    
    print("✅ Server is running")
    
    # Test user registration
    print("\nTesting user registration...")
    user = test_user_registration()
    if not user:
        print("❌ Registration failed")
        return
    
    print("✅ User registered successfully")
    
    # Test user login
    print("\nTesting user login...")
    token = test_user_login()
    if not token:
        print("❌ Login failed")
        return
    
    print("✅ User logged in successfully")
    
    # Test getting stations
    print("\nTesting station data...")
    if test_get_stations(token):
        print("✅ Stations retrieved successfully")
    else:
        print("❌ Failed to get stations")
    
    # Test creating report
    print("\nTesting report creation...")
    if test_create_report(token):
        print("✅ Report created successfully")
    else:
        print("❌ Failed to create report")
    
    print("\n🎉 All tests completed!")
    print(f"📖 View API docs: {BASE_URL}/docs")

if __name__ == "__main__":
    main()
