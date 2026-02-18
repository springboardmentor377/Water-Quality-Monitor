from sqlmodel import Session, select
from app.models import User, WaterStation, Report, Alert, StationReading, Collaboration, PredictiveAlert
from app.auth import hash_password
import random
from datetime import datetime, timedelta


def seed_data(session: Session):
    # Clear existing data
    session.exec(select(Report).subquery().select())
    reports = session.exec(select(Report)).all()
    for report in reports:
        session.delete(report)
        
    station_readings = session.exec(select(StationReading)).all()
    for reading in station_readings:
        session.delete(reading)
        
    alerts = session.exec(select(Alert)).all()
    for alert in alerts:
        session.delete(alert)
    
    stations = session.exec(select(WaterStation)).all()
    for station in stations:
        session.delete(station)
        
    users = session.exec(select(User)).all()
    for user in users:
        session.delete(user)
    
    session.commit()

    # Create users
    users_data = [
        {"name": "Citizen User", "email": "citizen@gmail.com", "password": "1234", "role": "citizen"},
        {"name": "Authority Officer", "email": "authority@gmail.com", "password": "1234", "role": "authority"},
        {"name": "Admin User", "email": "admin@gmail.com", "password": "1234", "role": "admin"},
        {"name": "NGO Representative", "email": "ngo@gmail.com", "password": "1234", "role": "ngo"}
    ]

    created_users = []
    for user_data in users_data:
        hashed_password = hash_password(user_data["password"])
        user = User(
            name=user_data["name"],
            email=user_data["email"],
            password=hashed_password,
            role=user_data["role"]
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        created_users.append(user)

    # Create water stations
    stations_data = [
        {"name": "Vizag Station", "latitude": 17.6868, "longitude": 83.2185, "location": "Visakhapatnam, India", "managed_by": "Local Water Authority"},
        {"name": "Gachibowli Station", "latitude": 17.4411, "longitude": 78.3915, "location": "Hyderabad, India", "managed_by": "Telangana Water Board"},
        {"name": "HITEC City Station", "latitude": 17.4653, "longitude": 78.5760, "location": "Hyderabad, India", "managed_by": "Hyderabad Metropolitan Water Supply"},
        {"name": "Secunderabad Station", "latitude": 17.4474, "longitude": 78.4944, "location": "Secunderabad, India", "managed_by": "Secunderabad Cantonment Board"},
        {"name": "Miyapur Station", "latitude": 17.5000, "longitude": 78.3914, "location": "Miyapur, India", "managed_by": "GHMC Water Department"},
        {"name": "Kukatpally Station", "latitude": 17.4750, "longitude": 78.3900, "location": "Kukatpally, India", "managed_by": "GHMC Water Department"},
        {"name": "Jubilee Hills Station", "latitude": 17.4330, "longitude": 78.3818, "location": "Jubilee Hills, India", "managed_by": "TS Water Corporation"},
        {"name": "Banjara Hills Station", "latitude": 17.4167, "longitude": 78.4517, "location": "Banjara Hills, India", "managed_by": "TS Water Corporation"},
        {"name": "LB Nagar Station", "latitude": 17.3500, "longitude": 78.5000, "location": "LB Nagar, India", "managed_by": "Ranga Reddy District Water Board"},
        {"name": "SR Nagar Station", "latitude": 17.4333, "longitude": 78.4167, "location": "SR Nagar, India", "managed_by": "GHMC Water Department"},
    ]

    created_stations = []
    for station_data in stations_data:
        station = WaterStation(**station_data)
        session.add(station)
        session.commit()
        session.refresh(station)
        created_stations.append(station)

    # Generate station readings and alerts based on WHO standards
    parameters = ["pH", "turbidity", "DO", "lead", "arsenic"]
    # WHO standards: pH (6.5-8.5), turbidity (<5 NTU), DO (>5 mg/L), lead (<0.01 mg/L), arsenic (<0.01 mg/L)
    
    for station in created_stations:
        for _ in range(10):  # Create 10 readings per station
            param = random.choice(parameters)
            
            if param == "pH":
                # Mostly within range but sometimes outside
                value = round(random.uniform(6.0, 9.0), 1) if random.random() > 0.8 else round(random.uniform(5.5, 9.5), 1)
            elif param == "turbidity":
                # Mostly within range but sometimes outside
                value = round(random.uniform(1.0, 6.0), 1) if random.random() > 0.8 else round(random.uniform(0.5, 10.0), 1)
            elif param == "DO":
                # Mostly within range but sometimes outside
                value = round(random.uniform(4.0, 10.0), 1) if random.random() > 0.8 else round(random.uniform(2.0, 12.0), 1)
            elif param == "lead":
                # Mostly within range but sometimes outside
                value = round(random.uniform(0.005, 0.012), 3) if random.random() > 0.8 else round(random.uniform(0.001, 0.02), 3)
            elif param == "arsenic":
                # Mostly within range but sometimes outside
                value = round(random.uniform(0.005, 0.012), 3) if random.random() > 0.8 else round(random.uniform(0.001, 0.02), 3)
            
            reading = StationReading(
                station_id=station.id,
                parameter=param,
                value=value,
                recorded_at=datetime.utcnow() - timedelta(days=random.randint(0, 30))
            )
            session.add(reading)
            session.commit()
            session.refresh(reading)
            
            # Check if the reading exceeds thresholds and create an alert if needed
            # Threshold values based on WHO standards
            thresholds = {
                "pH": {"min": 6.5, "max": 8.5},
                "turbidity": {"max": 5.0},  # NTU
                "DO": {"min": 5.0},  # mg/L dissolved oxygen
                "lead": {"max": 0.01},  # mg/L
                "arsenic": {"max": 0.01}  # mg/L
            }
            
            alert_needed = False
            alert_message = ""
            
            if param == "pH":
                if value < thresholds["pH"]["min"] or value > thresholds["pH"]["max"]:
                    alert_needed = True
                    alert_message = f"pH level {'too low' if value < thresholds['pH']['min'] else 'too high'}: {value} (threshold: {'<' + str(thresholds['pH']['max']) if value > thresholds['pH']['max'] else '>' + str(thresholds['pH']['min'])})"
            elif param == "turbidity":
                if value > thresholds["turbidity"]["max"]:
                    alert_needed = True
                    alert_message = f"turbidity level too high: {value} (threshold: <{thresholds['turbidity']['max']})"
            elif param == "DO":
                if value < thresholds["DO"]["min"]:
                    alert_needed = True
                    alert_message = f"DO level too low: {value} (threshold: >{thresholds['DO']['min']})"
            elif param == "lead":
                if value > thresholds["lead"]["max"]:
                    alert_needed = True
                    alert_message = f"lead level too high: {value} (threshold: <{thresholds['lead']['max']})"
            elif param == "arsenic":
                if value > thresholds["arsenic"]["max"]:
                    alert_needed = True
                    alert_message = f"arsenic level too high: {value} (threshold: <{thresholds['arsenic']['max']})"
            
            if alert_needed:
                alert = Alert(
                    type="contamination",
                    message=alert_message,
                    location=station.location,
                    station_id=station.id,
                    reading_id=reading.id,
                    issued_at=datetime.utcnow() - timedelta(days=random.randint(0, 15))
                )
                session.add(alert)
                session.commit()

    # Create 50 sample reports with varied data
    locations_and_coords = [
        ("Beach Road, Visakhapatnam", 17.7215, 83.2992),
        ("Gachibowli Lake, Hyderabad", 17.4411, 78.3915),
        ("Near HITEC City, Hyderabad", 17.4653, 78.5760),
        ("Habsiguda, Hyderabad", 17.4240, 78.5120),
        ("Kukatpally, Hyderabad", 17.4750, 78.3900),
        ("LB Nagar, Hyderabad", 17.3500, 78.5000),
        ("SR Nagar, Hyderabad", 17.4333, 78.4167),
        ("Jubilee Hills, Hyderabad", 17.4330, 78.3818),
        ("Banjara Hills, Hyderabad", 17.4167, 78.4517),
        ("Secunderabad, Telangana", 17.4474, 78.4944),
        ("Miyapur, Hyderabad", 17.5000, 78.3914),
        ("Ameerpet, Hyderabad", 17.4380, 78.4480),
        ("Begumpet, Hyderabad", 17.4419, 78.4664),
        ("Khairatabad, Hyderabad", 17.4178, 78.4642),
        ("Somajiguda, Hyderabad", 17.4267, 78.4483),
        ("Panjagutta, Hyderabad", 17.4250, 78.4500),
        ("Nampally, Hyderabad", 17.3850, 78.4700),
        ("Malakpet, Hyderabad", 17.3667, 78.4667),
        ("Musheerabad, Hyderabad", 17.3833, 78.4667),
        ("Darushifa, Hyderabad", 17.3833, 78.4833),
        ("Dilsukhnagar, Hyderabad", 17.3833, 78.4833),
        ("Kothapet, Hyderabad", 17.4833, 78.3833),
        ("Balanagar, Hyderabad", 17.4667, 78.4333),
        ("Erragadda, Hyderabad", 17.4500, 78.4500),
        ("Srinagar Colony, Hyderabad", 17.4167, 78.4500),
        ("Bharat Nagar, Hyderabad", 17.4000, 78.4333),
        ("Chikkadpally, Hyderabad", 17.3833, 78.4333),
        ("RTC X Roads, Hyderabad", 17.3833, 78.4500),
        ("Basheerbagh, Hyderabad", 17.4000, 78.4667),
        ("Nehrunagar, Hyderabad", 17.3667, 78.4500),
        ("Saidabad, Hyderabad", 17.3333, 78.4500),
        ("Yousufguda, Hyderabad", 17.4333, 78.4333),
        ("JNTU, Hyderabad", 17.4667, 78.3333),
        ("KPHB, Hyderabad", 17.4833, 78.3833),
        ("Kompally, Hyderabad", 17.5000, 78.3667),
        ("Bowrampet, Hyderabad", 17.5167, 78.3667),
        ("Peerzadiguda, Hyderabad", 17.5333, 78.3667),
        ("Gandipet, Hyderabad", 17.2833, 78.3833),
        ("Lingampally, Hyderabad", 17.5167, 78.3500),
        ("Moghalpura, Hyderabad", 17.3667, 78.4833),
        ("Aziznagar, Hyderabad", 17.3500, 78.4833),
        ("Bagh Amberpet, Hyderabad", 17.3833, 78.5000),
        ("Karwan, Hyderabad", 17.3500, 78.5000),
        ("Falaknuma, Hyderabad", 17.3667, 78.4833),
        ("Charminar, Hyderabad", 17.3667, 78.4750),
        ("Shamshabad, Hyderabad", 17.2500, 78.3833),
        ("Golconda, Hyderabad", 17.3667, 78.4000),
        ("Uppal, Hyderabad", 17.3333, 78.5333),
        ("Neredmet, Hyderabad", 17.5167, 78.3500),
        ("Hayathnagar, Hyderabad", 17.2833, 78.4333)
    ]
    
    water_sources = [
        "River water", "Lake water", "Ground water", "Tap water", "Well water",
        "Canal water", "Pond water", "Reservoir water", "Spring water", "Sea water"
    ]
    
    descriptions = [
        "Pollution detected in water source",
        "Chemical waste discharge into the water body",
        "Oil spill observed in the water",
        "Algae bloom covering significant portion of the water body",
        "Sewage mixing with the water supply",
        "Contaminated drinking water from municipal supply",
        "Industrial effluent discharge",
        "Plastic waste accumulation",
        "Unusual coloration of water",
        "Bad odor from water source",
        "Dead fish found near water source",
        "Foaming on water surface",
        "Suspicious chemical smell",
        "Turbid water with sediments",
        "Acidic water with low pH",
        "High mineral content in water",
        "Heavy metal contamination",
        "Bacterial contamination",
        "Pesticide residue detected",
        "Fecal matter in water"
    ]
    
    statuses = ["pending", "verified", "rejected", "in-progress"]

    for i in range(50):
        location, lat, lng = random.choice(locations_and_coords)
        water_source = random.choice(water_sources)
        description = random.choice(descriptions)
        status = random.choice(statuses)
        user = random.choice(created_users)
        
        report = Report(
            user_id=user.id,
            location=location,
            latitude=lat,
            longitude=lng,
            description=description,
            water_source=water_source,
            station_id=random.choice(created_stations).id if random.random() > 0.7 else None,  # Some reports linked to stations
            alert_id=random.choice([a.id for a in session.exec(select(Alert)).all()]) if random.random() > 0.8 and session.exec(select(Alert)).all() else None,  # Some reports linked to alerts
            status=status,
            created_at=datetime.utcnow() - timedelta(days=random.randint(0, 90))
        )
        session.add(report)
        session.commit()

    # Create sample collaborations
    # Get the NGO user to assign the collaborations to
    ngo_user = session.exec(select(User).where(User.role == "ngo")).first()
    if ngo_user:
        collaborations_data = [
            {
                "user_id": ngo_user.id,
                "project_name": "Clean Water Initiative",
                "contact_email": "contact@wateraid.org",
                "description": "Providing clean drinking water to rural communities",
                "start_date": datetime.utcnow() - timedelta(days=180)
            },
            {
                "user_id": ngo_user.id,
                "project_name": "Rural Water Access",
                "contact_email": "water@unicef.org",
                "description": "Improving water access in remote areas",
                "start_date": datetime.utcnow() - timedelta(days=120)
            },
            {
                "user_id": ngo_user.id,
                "project_name": "Contamination Cleanup",
                "contact_email": "cleanup@greenearth.org",
                "description": "Cleaning contaminated water sources",
                "start_date": datetime.utcnow() - timedelta(days=90)
            },
            {
                "user_id": ngo_user.id,
                "project_name": "River Restoration Project",
                "contact_email": "info@cleanrivers.org",
                "description": "Restoring polluted river ecosystems",
                "start_date": datetime.utcnow() - timedelta(days=60)
            }
        ]

        # Additional sample NGO projects to provide more demo content
        extra_projects = [
            {
                "user_id": ngo_user.id,
                "project_name": "School Water Safety",
                "contact_email": "schools@cleandrink.org",
                "description": "Install and maintain safe drinking water points in schools",
                "start_date": datetime.utcnow() - timedelta(days=45)
            },
            {
                "user_id": ngo_user.id,
                "project_name": "Community Filtration",
                "contact_email": "projects@filter4all.org",
                "description": "Deploy low-cost filtration units in villages",
                "start_date": datetime.utcnow() - timedelta(days=30)
            },
            {
                "user_id": ngo_user.id,
                "project_name": "Awareness & Hygiene",
                "contact_email": "info@hygienefirst.org",
                "description": "Public workshops on water hygiene and contamination prevention",
                "start_date": datetime.utcnow() - timedelta(days=20)
            },
            {
                "user_id": ngo_user.id,
                "project_name": "Sensor Deployment",
                "contact_email": "sensors@openwater.org",
                "description": "Deploy low-cost sensors for continuous water quality monitoring",
                "start_date": datetime.utcnow() - timedelta(days=10)
            },
            {
                "user_id": ngo_user.id,
                "project_name": "Watershed Protection",
                "contact_email": "protect@watershed.org",
                "description": "Protect and restore critical watershed areas from contamination",
                "start_date": datetime.utcnow() - timedelta(days=60)
            },
            {
                "user_id": ngo_user.id,
                "project_name": "Urban Water Access",
                "contact_email": "urban@waterforall.org",
                "description": "Improve water access in underserved urban communities",
                "start_date": datetime.utcnow() - timedelta(days=35)
            },
            {
                "user_id": ngo_user.id,
                "project_name": "Groundwater Recharge",
                "contact_email": "recharge@greenwater.org",
                "description": "Implement rainwater harvesting and groundwater recharge systems",
                "start_date": datetime.utcnow() - timedelta(days=25)
            },
            {
                "user_id": ngo_user.id,
                "project_name": "Water Quality Labs",
                "contact_email": "labs@watercheck.org",
                "description": "Establish mobile water testing laboratories for remote areas",
                "start_date": datetime.utcnow() - timedelta(days=15)
            }
        ]
        collaborations_data.extend(extra_projects)
        
        for collab_data in collaborations_data:
            collaboration = Collaboration(**collab_data)
            session.add(collaboration)
            session.commit()
            session.refresh(collaboration)
    
    # Create sample predictive alerts based on recent readings
    # Get all recent readings to generate predictive alerts
    recent_readings = session.exec(
        select(StationReading)
        .order_by(StationReading.recorded_at.desc())
        .limit(20)
    ).all()
    
    # Generate predictive alerts based on trends
    risk_levels = ["low", "medium", "high"]
    parameters = ["pH", "turbidity", "DO", "lead", "arsenic"]
    
    for i in range(10):  # Create 10 predictive alerts
        # Pick a random station and parameter
        station = random.choice(created_stations)
        param = random.choice(parameters)
        
        # Generate a predicted value based on random factors
        if param == "pH":
            predicted_value = round(random.uniform(6.0, 9.0), 2)
        elif param == "turbidity":
            predicted_value = round(random.uniform(0.5, 10.0), 2)
        elif param == "DO":
            predicted_value = round(random.uniform(2.0, 12.0), 2)
        elif param == "lead":
            predicted_value = round(random.uniform(0.001, 0.02), 3)
        elif param == "arsenic":
            predicted_value = round(random.uniform(0.001, 0.02), 3)
        
        risk_level = random.choice(risk_levels)
        confidence_level = round(random.uniform(0.6, 0.95), 2)
        threshold_exceeded = random.choice([True, False]) if risk_level != "low" else False
        
        alert_message = f"Predicted {risk_level} risk for {param} levels at {station.name}" 
        
        predictive_alert = PredictiveAlert(
            station_id=station.id,
            parameter=param,
            predicted_value=predicted_value,
            confidence_level=confidence_level,
            risk_level=risk_level,
            expires_at=datetime.utcnow() + timedelta(days=2),
            model_used="Simple Trend Analysis",
            threshold_exceeded=threshold_exceeded,
            alert_message=alert_message
        )
        
        session.add(predictive_alert)
        session.commit()
        session.refresh(predictive_alert)

    print("✅ Database tables created and seeded successfully")