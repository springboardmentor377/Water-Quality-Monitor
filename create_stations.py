#!/usr/bin/env python3
"""
Create water stations table and seed data
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

import sqlite3
from database import engine, Base

def create_stations_table():
    """Create water stations table and seed data"""
    
    db_path = os.path.join(os.path.dirname(__file__), 'backend', 'water_quality.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Create waterstations table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS waterstations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR NOT NULL,
                location VARCHAR,
                latitude REAL,
                longitude REAL,
                status VARCHAR DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Check if stations already exist
        cursor.execute("SELECT COUNT(*) FROM waterstations")
        count = cursor.fetchone()[0]
        
        if count == 0:
            print("Seeding 40 water stations...")
            stations = [
                ("Yamuna - Delhi", "Delhi", 28.6139, 77.2090),
                ("Ganga - Varanasi", "Varanasi", 25.3176, 82.9739),
                ("Ganga - Haridwar", "Haridwar", 29.9457, 78.1642),
                ("Ganga - Patna", "Patna", 25.5941, 85.1376),
                ("Ganga - Kolkata", "Kolkata", 22.5726, 88.3639),
                ("Godavari - Nashik", "Nashik", 19.9975, 73.7898),
                ("Godavari - Rajahmundry", "Rajahmundry", 16.9891, 81.7780),
                ("Krishna - Vijayawada", "Vijayawada", 16.5062, 80.6480),
                ("Krishna - Sangli", "Sangli", 16.8524, 74.5815),
                ("Cauvery - Mysore", "Mysore", 12.2958, 76.6394),
                ("Cauvery - Bangalore", "Bangalore", 12.9716, 77.5946),
                ("Brahmaputra - Guwahati", "Guwahati", 26.1445, 91.7362),
                ("Mahanadi - Cuttack", "Cuttack", 20.4625, 85.8830),
                ("Narmada - Jabalpur", "Jabalpur", 23.1815, 79.9864),
                ("Tapi - Surat", "Surat", 21.1702, 72.8311),
                ("Indus - Leh", "Leh", 34.1526, 77.5771),
                ("Ganga - Rishikesh", "Rishikesh", 30.0869, 78.2676),
                ("Yamuna - Agra", "Agra", 27.1767, 78.0081),
                ("Ganga - Kanpur", "Kanpur", 26.4499, 80.3319),
                ("Godavari - Aurangabad", "Aurangabad", 19.8762, 75.3433),
                ("Krishna - Satara", "Satara", 17.6827, 74.0150),
                ("Cauvery - Tiruchirappalli", "Tiruchirappalli", 10.7905, 78.7047),
                ("Brahmaputra - Dibrugarh", "Dibrugarh", 27.4785, 94.9119),
                ("Mahanadi - Sambalpur", "Sambalpur", 21.4664, 83.9769),
                ("Narmada - Hoshangabad", "Hoshangabad", 22.7496, 77.7249),
                ("Tapi - Bhusawal", "Bhusawal", 21.0464, 75.7873),
                ("Indus - Srinagar", "Srinagar", 34.0837, 74.7973),
                ("Ganga - Allahabad", "Allahabad", 25.4358, 81.8463),
                ("Yamuna - Prayagraj", "Prayagraj", 25.4358, 81.8463),
                ("Godavari - Nanded", "Nanded", 19.1539, 77.3117),
                ("Krishna - Vijayawada", "Vijayawada", 16.5062, 80.6480),
                ("Cauvery - Kumbakonam", "Kumbakonam", 10.9617, 79.3857),
                ("Brahmaputra - Tezpur", "Tezpur", 26.6575, 92.7938),
                ("Mahanadi - Bhubaneswar", "Bhubaneswar", 20.2961, 85.8245),
                ("Narmada - Bharuch", "Bharuch", 21.7075, 72.9976),
                ("Tapi - Malegaon", "Malegaon", 20.5566, 74.5310),
                ("Indus - Jammu", "Jammu", 32.7266, 74.8570),
                ("Ganga - Farakka", "Farakka", 24.8155, 88.0694),
                ("Yamuna - Delhi-Noida Border", "Delhi-Noida Border", 28.5957, 77.3293),
                ("Godavari - Nashik-Triambak", "Nashik-Triambak", 19.9314, 73.5496),
            ]
            
            cursor.executemany("""
                INSERT INTO waterstations (name, location, latitude, longitude, status)
                VALUES (?, ?, ?, ?, 'active')
            """, stations)
            
            conn.commit()
            print(f"✓ Created {len(stations)} water stations!")
        else:
            print(f"✓ Water stations already exist: {count} stations")
        
    except Exception as e:
        print(f"✗ Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    print("🌊 Creating water stations...")
    create_stations_table()
