from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Report
from app.utils import require_role

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/predict")
def predict(
    station_id: str,
    db: Session = Depends(get_db),
    user=Depends(require_role(["ngo", "admin"]))
):
    """
    Predict next 3 water quality values based on synthetic trend
    """
    # In a real app, we would fetch historical data from DB
    # Here we simulate valid historical data for the station to perform regression
    
    # Simulate last 24 hours of data (one reading per hour)
    import numpy as np
    from sklearn.linear_model import LinearRegression
    import random
    
    # Synthetic history
    X = np.array(range(24)).reshape(-1, 1) # Hours 0 to 23
    
    # Base values with some trend
    # pH: trending slightly down or up
    slope_ph = random.uniform(-0.01, 0.01)
    y_ph = [7.5 + slope_ph * x + random.uniform(-0.1, 0.1) for x in range(24)]
    
    # Turbidity: random fluctuation
    y_turb = [3.5 + random.uniform(-0.5, 0.5) for _ in range(24)]
    
    # DO: trending
    slope_do = random.uniform(-0.02, 0.02)
    y_do = [6.5 + slope_do * x + random.uniform(-0.2, 0.2) for x in range(24)]
    
    # Predict next 3 hours (24, 25, 26)
    next_hours = np.array([24, 25, 26]).reshape(-1, 1)
    
    # pH Prediction
    model = LinearRegression()
    model.fit(X, y_ph)
    pred_ph = model.predict(next_hours)
    
    # Turbidity Prediction
    model.fit(X, y_turb)
    pred_turb = model.predict(next_hours)
    
    # DO Prediction
    model.fit(X, y_do)
    pred_do = model.predict(next_hours)
    
    # Assessment
    # Safe checks: pH 6.5-8.5, Turbidity < 5, DO > 4
    future_risks = []
    
    if any(p < 6.5 or p > 8.5 for p in pred_ph):
        future_risks.append("pH levels predicted to go out of safe range")
    
    if any(t > 5.0 for t in pred_turb):
        future_risks.append("Turbidity predicted to exceed limits")
        
    if any(d < 4.0 for d in pred_do):
        future_risks.append("Dissolved Oxygen predicted to drop below critical level")
        
    risk_level = "Critical" if future_risks else "Low"
    
    return {
        "station_id": station_id,
        "predictions": {
            "next_3_hours": [
                {
                    "hour": "+1h",
                    "pH": round(pred_ph[0], 2),
                    "Turbidity": round(pred_turb[0], 2),
                    "DO": round(pred_do[0], 2)
                },
                {
                    "hour": "+2h",
                    "pH": round(pred_ph[1], 2),
                    "Turbidity": round(pred_turb[1], 2),
                    "DO": round(pred_do[1], 2)
                },
                {
                    "hour": "+3h",
                    "pH": round(pred_ph[2], 2),
                    "Turbidity": round(pred_turb[2], 2),
                    "DO": round(pred_do[2], 2)
                }
            ]
        },
        "risk_level": risk_level,
        "alerts": future_risks
    }
