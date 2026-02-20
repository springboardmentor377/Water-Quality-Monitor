from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import datetime, timedelta
from typing import List, Dict, Any
import json
import statistics

from app.database import get_session
from app.models import Report, WaterStation, StationReading, Alert, User, Notification, AnalyticsReport
from app.deps import get_current_user
from app.schemas import AnalyticsReportCreate

router = APIRouter(prefix="/analytics")


@router.get("/reports")
def get_report_statistics(session: Session = Depends(get_session)):
    """Get comprehensive report statistics"""
    reports = session.exec(select(Report)).all()
    
    # Basic counts
    total_reports = len(reports)
    pending_reports = len([r for r in reports if r.status == "pending"])
    verified_reports = len([r for r in reports if r.status == "verified"])
    rejected_reports = len([r for r in reports if r.status == "rejected"])
    
    # Source distribution
    source_counts = {}
    for report in reports:
        source = report.water_source or "Unknown"
        source_counts[source] = source_counts.get(source, 0) + 1
    
    # Status distribution
    status_counts = {
        "pending": pending_reports,
        "verified": verified_reports,
        "rejected": rejected_reports
    }
    
    # Recent reports (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_reports = [r for r in reports if r.created_at >= thirty_days_ago]
    
    return {
        "total_reports": total_reports,
        "pending_count": pending_reports,
        "verified_count": verified_reports,
        "rejected_count": rejected_reports,
        "by_source": source_counts,
        "by_status": status_counts,
        "recent_reports_count": len(recent_reports),
        "verification_rate": (verified_reports / total_reports * 100) if total_reports > 0 else 0
    }


@router.get("/alerts")
def get_alert_statistics(session: Session = Depends(get_session)):
    """Get alert statistics"""
    alerts = session.exec(select(Alert)).all()
    
    total_alerts = len(alerts)
    active_alerts = len([a for a in alerts if a.is_active])
    
    # Alert type distribution
    type_counts = {}
    for alert in alerts:
        type_counts[alert.type] = type_counts.get(alert.type, 0) + 1
    
    # Recent alerts (last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    recent_alerts = [a for a in alerts if a.issued_at >= seven_days_ago]
    
    return {
        "total_alerts": total_alerts,
        "active_count": active_alerts,
        "inactive_count": total_alerts - active_alerts,
        "by_type": type_counts,
        "recent_alerts": len(recent_alerts),
        "active_percentage": (active_alerts / total_alerts * 100) if total_alerts > 0 else 0
    }


@router.get("/stations")
def get_station_statistics(session: Session = Depends(get_session)):
    """Get station statistics"""
    stations = session.exec(select(WaterStation)).all()
    readings = session.exec(select(StationReading)).all()
    
    total_stations = len(stations)
    total_readings = len(readings)
    
    # Readings per station
    readings_by_station = {}
    for reading in readings:
        readings_by_station[reading.station_id] = readings_by_station.get(reading.station_id, 0) + 1
    
    # Parameters monitored
    parameters = list(set([r.parameter for r in readings]))
    
    # Recent readings (last 24 hours)
    twenty_four_hours_ago = datetime.utcnow() - timedelta(hours=24)
    recent_readings = [r for r in readings if r.recorded_at >= twenty_four_hours_ago]
    
    return {
        "total_stations": total_stations,
        "total_readings": total_readings,
        "readings_by_station": readings_by_station,
        "parameters_monitored": parameters,
        "recent_readings_count": len(recent_readings),
        "average_readings_per_station": total_readings / total_stations if total_stations > 0 else 0
    }


@router.get("/trends")
def get_trend_analysis(
    days: int = 30,
    session: Session = Depends(get_session)
):
    """Get trend analysis for water quality parameters"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    # Get recent readings
    readings = session.exec(
        select(StationReading)
        .where(StationReading.recorded_at >= cutoff_date)
        .order_by(StationReading.recorded_at)
    ).all()
    
    # Group by parameter and date
    parameter_trends = {}
    
    for reading in readings:
        param = reading.parameter
        date_key = reading.recorded_at.date()
        
        if param not in parameter_trends:
            parameter_trends[param] = {}
        
        if date_key not in parameter_trends[param]:
            parameter_trends[param][date_key] = []
        
        parameter_trends[param][date_key].append(reading.value)
    
    # Calculate daily averages
    trends = {}
    for param, daily_data in parameter_trends.items():
        trends[param] = []
        for date, values in daily_data.items():
            avg_value = sum(values) / len(values)
            trends[param].append({
                "date": date.isoformat(),
                "average": round(avg_value, 3),
                "count": len(values)
            })
        
        # Sort by date
        trends[param].sort(key=lambda x: x["date"])
    
    return trends


@router.get("/quality-index")
def get_water_quality_index(session: Session = Depends(get_session)):
    """Calculate overall water quality index"""
    # Get recent readings (last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    recent_readings = session.exec(
        select(StationReading)
        .where(StationReading.recorded_at >= seven_days_ago)
    ).all()
    
    if not recent_readings:
        return {"quality_index": 0, "status": "No data available"}
    
    # WHO standard thresholds
    thresholds = {
        "pH": {"min": 6.5, "max": 8.5, "weight": 0.25},
        "turbidity": {"max": 5.0, "weight": 0.20},  # NTU
        "DO": {"min": 5.0, "weight": 0.20},  # mg/L
        "lead": {"max": 0.01, "weight": 0.15},  # mg/L
        "arsenic": {"max": 0.01, "weight": 0.20}  # mg/L
    }
    
    # Calculate parameter scores
    parameter_scores = {}
    parameter_counts = {}
    
    for reading in recent_readings:
        param = reading.parameter
        value = reading.value
        
        if param not in thresholds:
            continue
            
        if param not in parameter_scores:
            parameter_scores[param] = []
            parameter_counts[param] = 0
            
        threshold = thresholds[param]
        score = 100  # Start with perfect score
        
        # Calculate score based on thresholds
        if "min" in threshold and value < threshold["min"]:
            # Linear penalty for values below minimum
            deviation = (threshold["min"] - value) / threshold["min"]
            score = max(0, 100 - (deviation * 100))
        elif "max" in threshold and value > threshold["max"]:
            # Linear penalty for values above maximum
            deviation = (value - threshold["max"]) / threshold["max"]
            score = max(0, 100 - (deviation * 100))
        
        parameter_scores[param].append(score)
        parameter_counts[param] += 1
    
    # Calculate average scores per parameter
    avg_scores = {}
    for param, scores in parameter_scores.items():
        if scores:
            avg_scores[param] = sum(scores) / len(scores)
    
    # Calculate weighted quality index
    total_weight = sum(thresholds[p]["weight"] for p in avg_scores.keys())
    quality_index = 0
    
    for param, score in avg_scores.items():
        weight = thresholds[param]["weight"]
        quality_index += (score * weight / total_weight)
    
    # Determine status
    if quality_index >= 80:
        status = "Excellent"
    elif quality_index >= 60:
        status = "Good"
    elif quality_index >= 40:
        status = "Fair"
    else:
        status = "Poor"
    
    return {
        "quality_index": round(quality_index, 2),
        "status": status,
        "parameter_scores": {k: round(v, 2) for k, v in avg_scores.items()},
        "total_readings": len(recent_readings)
    }


@router.get("/user-activity")
def get_user_activity_stats(session: Session = Depends(get_session)):
    """Get user activity statistics"""
    users = session.exec(select(User)).all()
    reports = session.exec(select(Report)).all()
    
    # Reports per user
    reports_by_user = {}
    for report in reports:
        reports_by_user[report.user_id] = reports_by_user.get(report.user_id, 0) + 1
    
    # User roles distribution
    role_counts = {}
    for user in users:
        role = user.role
        role_counts[role] = role_counts.get(role, 0) + 1
    
    # Active users (users with reports in last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_report_users = set()
    for report in reports:
        if report.created_at >= thirty_days_ago:
            recent_report_users.add(report.user_id)
    
    return {
        "total_users": len(users),
        "reports_by_user": reports_by_user,
        "role_distribution": role_counts,
        "active_users_count": len(recent_report_users),
        "reports_per_user_avg": len(reports) / len(users) if users else 0
    }


@router.post("/reports")
def generate_analytics_report(
    report_data: AnalyticsReportCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Generate and save an analytics report"""
    # Generate report data based on type
    if report_data.report_type == "weekly":
        days = 7
    elif report_data.report_type == "monthly":
        days = 30
    elif report_data.report_type == "quarterly":
        days = 90
    else:
        days = report_data.report_type  # Custom number of days
    
    # Get data for the period
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    reports = session.exec(
        select(Report).where(Report.created_at >= cutoff_date)
    ).all()
    
    alerts = session.exec(
        select(Alert).where(Alert.issued_at >= cutoff_date)
    ).all()
    
    readings = session.exec(
        select(StationReading).where(StationReading.recorded_at >= cutoff_date)
    ).all()
    
    # Compile report data
    report_content = {
        "period_days": days,
        "generated_at": datetime.utcnow().isoformat(),
        "summary": {
            "total_reports": len(reports),
            "total_alerts": len(alerts),
            "total_readings": len(readings)
        },
        "reports_by_status": {
            "pending": len([r for r in reports if r.status == "pending"]),
            "verified": len([r for r in reports if r.status == "verified"]),
            "rejected": len([r for r in reports if r.status == "rejected"])
        },
        "alerts_by_type": {},
        "readings_by_parameter": {}
    }
    
    # Alert type distribution
    for alert in alerts:
        alert_type = alert.type
        report_content["alerts_by_type"][alert_type] = report_content["alerts_by_type"].get(alert_type, 0) + 1
    
    # Reading parameter distribution
    for reading in readings:
        param = reading.parameter
        report_content["readings_by_parameter"][param] = report_content["readings_by_parameter"].get(param, 0) + 1
    
    # Create analytics report record
    analytics_report = AnalyticsReport(
        title=report_data.title,
        description=report_data.description,
        report_type=report_data.report_type,
        data=json.dumps(report_content),
        generated_by=current_user.id
    )
    
    session.add(analytics_report)
    session.commit()
    session.refresh(analytics_report)
    
    return {
        "id": analytics_report.id,
        "title": analytics_report.title,
        "report_data": report_content
    }


@router.get("/reports/history")
def get_analytics_reports_history(session: Session = Depends(get_session)):
    """Get history of generated analytics reports"""
    reports = session.exec(
        select(AnalyticsReport)
        .order_by(AnalyticsReport.generated_at.desc())
    ).all()
    
    return [
        {
            "id": report.id,
            "title": report.title,
            "description": report.description,
            "report_type": report.report_type,
            "generated_at": report.generated_at,
            "generated_by": report.generated_by
        }
        for report in reports
    ]