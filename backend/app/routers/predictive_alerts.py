from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from datetime import datetime, timedelta
from typing import List
import random

from app.database import get_session
from app.models import PredictiveAlert, StationReading, WaterStation
from app.schemas import PredictiveAlertCreate, PredictiveAlertUpdate
from app.deps import get_current_user

router = APIRouter(prefix="/predictive-alerts")


@router.get("/", response_model=List[dict])
def get_predictive_alerts(session: Session = Depends(get_session)):
    predictive_alerts = session.exec(
        select(PredictiveAlert).where(PredictiveAlert.is_active == True)
    ).all()
    return [
        {
            "id": alert.id,
            "station_id": alert.station_id,
            "parameter": alert.parameter,
            "predicted_value": alert.predicted_value,
            "confidence_level": alert.confidence_level,
            "risk_level": alert.risk_level,
            "predicted_at": alert.predicted_at,
            "expires_at": alert.expires_at,
            "is_active": alert.is_active,
            "model_used": alert.model_used,
            "threshold_exceeded": alert.threshold_exceeded,
            "alert_message": alert.alert_message,
            "created_at": alert.created_at
        }
        for alert in predictive_alerts
    ]


@router.get("/{alert_id}", response_model=dict)
def get_predictive_alert(alert_id: int, session: Session = Depends(get_session)):
    alert = session.get(PredictiveAlert, alert_id)
    if not alert:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Predictive alert not found")
    
    return {
        "id": alert.id,
        "station_id": alert.station_id,
        "parameter": alert.parameter,
        "predicted_value": alert.predicted_value,
        "confidence_level": alert.confidence_level,
        "risk_level": alert.risk_level,
        "predicted_at": alert.predicted_at,
        "expires_at": alert.expires_at,
        "is_active": alert.is_active,
        "model_used": alert.model_used,
        "threshold_exceeded": alert.threshold_exceeded,
        "alert_message": alert.alert_message,
        "created_at": alert.created_at
    }


@router.post("/", response_model=dict)
def create_predictive_alert(
    alert_create: PredictiveAlertCreate, 
    session: Session = Depends(get_session)
):
    predictive_alert = PredictiveAlert(
        station_id=alert_create.station_id,
        parameter=alert_create.parameter,
        predicted_value=alert_create.predicted_value,
        confidence_level=alert_create.confidence_level,
        risk_level=alert_create.risk_level,
        expires_at=alert_create.expires_at,
        model_used=alert_create.model_used,
        threshold_exceeded=alert_create.threshold_exceeded,
        alert_message=alert_create.alert_message
    )
    session.add(predictive_alert)
    session.commit()
    session.refresh(predictive_alert)
    
    return {
        "id": predictive_alert.id,
        "station_id": predictive_alert.station_id,
        "parameter": predictive_alert.parameter,
        "predicted_value": predictive_alert.predicted_value,
        "confidence_level": predictive_alert.confidence_level,
        "risk_level": predictive_alert.risk_level,
        "predicted_at": predictive_alert.predicted_at,
        "expires_at": predictive_alert.expires_at,
        "is_active": predictive_alert.is_active,
        "model_used": predictive_alert.model_used,
        "threshold_exceeded": predictive_alert.threshold_exceeded,
        "alert_message": predictive_alert.alert_message,
        "created_at": predictive_alert.created_at
    }


@router.put("/{alert_id}", response_model=dict)
def update_predictive_alert(
    alert_id: int, 
    alert_update: PredictiveAlertUpdate, 
    session: Session = Depends(get_session)
):
    alert = session.get(PredictiveAlert, alert_id)
    if not alert:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Predictive alert not found")
    
    # Update fields that are provided
    for field, value in alert_update.dict(exclude_unset=True).items():
        setattr(alert, field, value)
    
    session.add(alert)
    session.commit()
    session.refresh(alert)
    
    return {
        "id": alert.id,
        "station_id": alert.station_id,
        "parameter": alert.parameter,
        "predicted_value": alert.predicted_value,
        "confidence_level": alert.confidence_level,
        "risk_level": alert.risk_level,
        "predicted_at": alert.predicted_at,
        "expires_at": alert.expires_at,
        "is_active": alert.is_active,
        "model_used": alert.model_used,
        "threshold_exceeded": alert.threshold_exceeded,
        "alert_message": alert.alert_message,
        "created_at": alert.created_at
    }


@router.delete("/{alert_id}")
def delete_predictive_alert(alert_id: int, session: Session = Depends(get_session)):
    alert = session.get(PredictiveAlert, alert_id)
    if not alert:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Predictive alert not found")
    
    session.delete(alert)
    session.commit()
    
    return {"message": "Predictive alert deleted successfully"}


# Endpoint to generate predictive alerts based on recent readings
@router.post("/generate")
def generate_predictive_alerts(session: Session = Depends(get_session)):
    """Generate predictive alerts based on recent station readings"""
    # Get all active stations
    stations = session.exec(select(WaterStation)).all()
    
    generated_alerts = []
    
    for station in stations:
        # Get recent readings for this station
        recent_readings = session.exec(
            select(StationReading)
            .where(StationReading.station_id == station.id)
            .order_by(StationReading.recorded_at.desc())
            .limit(10)  # Get last 10 readings
        ).all()
        
        if len(recent_readings) >= 3:  # Need at least 3 readings to detect trend
            # Analyze trends for common parameters
            parameters_to_check = ['pH', 'turbidity', 'DO', 'lead', 'arsenic']
            
            for param in parameters_to_check:
                param_readings = [r for r in recent_readings if r.parameter == param]
                
                if len(param_readings) >= 3:
                    # Calculate trend (simple linear regression approximation)
                    values = [r.value for r in param_readings[:3]]  # Last 3 readings
                    values.reverse()  # Reverse to get chronological order
                    
                    # Calculate rate of change
                    if len(values) > 1:
                        avg_change = sum(values[i+1] - values[i] for i in range(len(values)-1)) / (len(values)-1)
                        
                        # Define thresholds based on parameter
                        thresholds = {
                            'pH': {'normal_min': 6.5, 'normal_max': 8.5, 'warning_range': 0.5},
                            'turbidity': {'normal_max': 1.0, 'warning_range': 0.5},
                            'DO': {'normal_min': 5.0, 'warning_range': 1.0},
                            'lead': {'normal_max': 0.01, 'warning_range': 0.005},
                            'arsenic': {'normal_max': 0.01, 'warning_range': 0.005}
                        }
                        
                        current_value = values[-1]  # Latest value
                        threshold = thresholds.get(param, {})
                        
                        risk_level = "low"
                        threshold_exceeded = False
                        
                        if param in ['pH', 'DO']:
                            # For pH and DO, check both min and max
                            if param == 'pH':
                                if current_value < threshold['normal_min'] or current_value > threshold['normal_max']:
                                    threshold_exceeded = True
                                    risk_level = "high"
                            elif param == 'DO':
                                if current_value < threshold['normal_min']:
                                    threshold_exceeded = True
                                    risk_level = "high"
                        else:
                            # For contaminants like turbidity, lead, arsenic - only check max
                            if current_value > threshold.get('normal_max', current_value + 1):
                                threshold_exceeded = True
                                risk_level = "high"
                        
                        # Check if rapid change is happening (trend detection)
                        if abs(avg_change) > threshold.get('warning_range', 0.1) and not threshold_exceeded:
                            risk_level = "medium" if risk_level == "low" else risk_level
                            threshold_exceeded = True
                        
                        # If risk detected, create predictive alert
                        if risk_level in ["medium", "high"]:
                            # Calculate confidence based on number of readings and trend consistency
                            confidence = min(0.7 + (abs(avg_change) * 0.1), 0.95)
                            
                            # Create predicted value based on trend
                            predicted_value = current_value + (avg_change * 3)  # Predict 3 intervals ahead
                            
                            # Create alert message
                            if risk_level == "high":
                                alert_msg = f"Critical {param} level detected at {station.name}. Current: {current_value:.2f}"
                            else:
                                alert_msg = f"Unusual {param} trend detected at {station.name}. Predicted value: {predicted_value:.2f}"
                            
                            # Create predictive alert
                            predictive_alert = PredictiveAlert(
                                station_id=station.id,
                                parameter=param,
                                predicted_value=predicted_value,
                                confidence_level=confidence,
                                risk_level=risk_level,
                                expires_at=datetime.utcnow() + timedelta(days=2),
                                model_used="Simple Trend Analysis",
                                threshold_exceeded=threshold_exceeded,
                                alert_message=alert_msg
                            )
                            
                            session.add(predictive_alert)
                            session.commit()
                            session.refresh(predictive_alert)
                            
                            generated_alerts.append({
                                "id": predictive_alert.id,
                                "station_id": predictive_alert.station_id,
                                "parameter": predictive_alert.parameter,
                                "predicted_value": predictive_alert.predicted_value,
                                "confidence_level": predictive_alert.confidence_level,
                                "risk_level": predictive_alert.risk_level,
                                "alert_message": predictive_alert.alert_message
                            })
    
    return {
        "message": f"Generated {len(generated_alerts)} predictive alerts",
        "alerts": generated_alerts
    }


# New endpoint: return time-series for an alert (historical readings + predicted points)
@router.get("/{alert_id}/series", response_model=dict)
def get_alert_series(alert_id: int, points: int = 20, session: Session = Depends(get_session)):
    """Return last `points` historical readings for the alert's station/parameter
    plus the predicted value and a few extrapolated future points for charting.
    """
    alert = session.get(PredictiveAlert, alert_id)
    if not alert:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Predictive alert not found")

    # Fetch historical readings for the station and parameter
    readings = session.exec(
        select(StationReading)
        .where(StationReading.station_id == alert.station_id)
        .where(StationReading.parameter == alert.parameter)
        .order_by(StationReading.recorded_at.desc())
        .limit(points)
    ).all()

    # Sort ascending to plot chronologically
    readings_sorted = list(reversed(readings))

    labels = [r.recorded_at.isoformat() for r in readings_sorted]
    values = [r.value for r in readings_sorted]

    # Add predicted point at alert.predicted_at (if present) otherwise now
    pred_time = alert.predicted_at.isoformat() if getattr(alert, 'predicted_at', None) else datetime.utcnow().isoformat()
    labels.append(pred_time)
    values.append(alert.predicted_value)

    # Simple extrapolation: add two future points by linear increment from last historical change
    if len(values) >= 2:
        # use last two historical values to compute delta
        last_hist_vals = values[-3:-1] if len(values) >= 3 else values[-2:]
        if len(last_hist_vals) == 2:
            delta = last_hist_vals[1] - last_hist_vals[0]
        else:
            delta = 0
    else:
        delta = 0

    # Add two projected future points spaced by 1 interval
    future1 = values[-1] + delta
    future2 = future1 + delta
    future_time1 = (datetime.fromisoformat(labels[-1]) + timedelta(hours=1)).isoformat()
    future_time2 = (datetime.fromisoformat(labels[-1]) + timedelta(hours=2)).isoformat()

    labels.extend([future_time1, future_time2])
    values.extend([future1, future2])

    return {
        "labels": labels,
        "values": values,
        "parameter": alert.parameter,
        "station_id": alert.station_id,
        "predicted_value": alert.predicted_value,
        "confidence_level": alert.confidence_level
    }