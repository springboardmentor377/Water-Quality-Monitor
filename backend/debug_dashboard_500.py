import requests
import os
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "http://localhost:8000"

def debug_dashboard():
    print("Debugging Dashboard 500 Error...")
    
    # 1. Login to get token
    login_data = {
        "username": "citizen123@gmail.com",  # Adjust if needed
        "password": "password123"            # Adjust if needed
    }
    
    # Try admin login if citizen fails or if we want to test admin role
    # login_data = {"username": "admin123@gmail.com", "password": "Admin@123"}
    
    print(f"Logging in as {login_data['username']}...")
    try:
        response = requests.post(f"{BASE_URL}/login", data=login_data)
        if response.status_code != 200:
            print(f"Login failed: {response.status_code} - {response.text}")
            # Try creating a user if login fails? Or just use the known admin
            print("Trying fallback admin login...")
            login_data = {"username": "admin123@gmail.com", "password": "Admin@123"}
            response = requests.post(f"{BASE_URL}/login", data=login_data)
            
            if response.status_code != 200:
                print("FATAL: Could not login.")
                return

        token = response.json()["access_token"]
        print("Login successful. Token received.")
        
        # 2. Fetch dashboard data with token
        headers = {"Authorization": f"Bearer {token}"}
        print("Fetching dashboard data...")
        dash_response = requests.get(f"{BASE_URL}/dashboard-data", headers=headers)
        
        if dash_response.status_code == 200:
            print("Success! Dashboard data fetched.")
        else:
            print(f"Error {dash_response.status_code}:")
            try:
                print(dash_response.json()) # This should show the traceback I added
            except:
                print(dash_response.text)
                
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    debug_dashboard()
