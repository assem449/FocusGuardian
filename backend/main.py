from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal, init_db, Session as DBSession
from webcam_utils import extract_metrics_from_frame
from ml_model import predict_focus_state
from datetime import datetime, timedelta
import numpy as np
import random

app = FastAPI()
init_db()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class HandActivity(BaseModel):
    visible: bool
    movement: str
    gesture: str

class Metrics(BaseModel):
    blink_rate: float
    gaze_direction: str
    head_pose: str
    hand_activity: HandActivity = None

@app.post("/capture")
async def capture_metrics(file: UploadFile = File(...)):
    frame_bytes = await file.read()
    metrics = extract_metrics_from_frame(frame_bytes)
    return metrics

@app.post("/predict")
def predict(metrics: Metrics, db: Session = Depends(get_db)):
    result = predict_focus_state(
        metrics.blink_rate,
        metrics.gaze_direction,
        metrics.head_pose,
        metrics.hand_activity.dict() if metrics.hand_activity else None
    )
    session = DBSession(
        timestamp=datetime.utcnow(),
        blink_rate=metrics.blink_rate,
        gaze_direction=metrics.gaze_direction,
        head_pose=metrics.head_pose,
        prediction=result["state"],
        confidence=result["confidence"]
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return {"prediction": result, "session_id": session.id}

@app.post("/predict/continuous")
def predict_continuous(db: Session = Depends(get_db)):
    blink_rate = float(np.random.uniform(10, 30))
    gaze_direction = np.random.choice(['center', 'left', 'right'])
    head_pose = np.random.choice(['straight', 'tilted_left', 'tilted_right'])
    hand_activity = {
        'visible': bool(np.random.choice([True, False], p=[0.7, 0.3])),
        'movement': str(np.random.choice(['none', 'mild', 'excessive'], p=[0.5, 0.3, 0.2])),
        'gesture': str(np.random.choice(['idle', 'touching_face', 'phone', 'fidgeting'], p=[0.5, 0.2, 0.15, 0.15]))
    }
    result = predict_focus_state(blink_rate, gaze_direction, head_pose, hand_activity)
    session = DBSession(
        timestamp=datetime.utcnow(),
        blink_rate=blink_rate,
        gaze_direction=gaze_direction,
        head_pose=head_pose,
        prediction=result["state"],
        confidence=result["confidence"]
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return {"prediction": result, "session_id": session.id}

@app.get("/history")
def get_history(db: Session = Depends(get_db)):
    sessions = db.query(DBSession).order_by(DBSession.timestamp.desc()).all()
    return [
        {
            "timestamp": s.timestamp,
            "blink_rate": s.blink_rate,
            "gaze_direction": s.gaze_direction,
            "head_pose": s.head_pose,
            "prediction": s.prediction,
            "confidence": s.confidence
        }
        for s in sessions
    ]

@app.get("/dashboard")
def get_dashboard_data(db: Session = Depends(get_db)):
    """Get comprehensive dashboard data for all sections"""
    
    # Get recent sessions for trend analysis
    recent_sessions = db.query(DBSession).order_by(DBSession.timestamp.desc()).limit(50).all()
    
    # Calculate focus trend data
    trend_data = []
    for i in range(8):
        hour = 9 + i  # 9 AM to 4 PM
        # Generate mock data for now - in real app, this would be aggregated from sessions
        value = random.randint(60, 85)
        trend_data.append({
            "time": f"{hour}AM" if hour < 12 else f"{hour-12}PM",
            "value": value
        })
    
    # Calculate average focus score
    if recent_sessions:
        avg_confidence = sum(s.confidence for s in recent_sessions) / len(recent_sessions)
        avg_score = int(avg_confidence * 100)
    else:
        avg_score = 75
    
    # Determine trend
    if len(trend_data) >= 2:
        recent_avg = sum(d["value"] for d in trend_data[-3:]) / 3
        earlier_avg = sum(d["value"] for d in trend_data[:3]) / 3
        if recent_avg > earlier_avg + 5:
            trend = "improving"
        elif recent_avg < earlier_avg - 5:
            trend = "declining"
        else:
            trend = "stable"
    else:
        trend = "stable"
    
    # Get current focus status from most recent session
    current_status = "focused"
    current_confidence = 0.85
    if recent_sessions:
        latest = recent_sessions[0]
        current_status = latest.prediction
        current_confidence = latest.confidence
    
    # Mock biometric data (in real app, this would come from sensors)
    biometric_data = {
        "heartRate": random.randint(65, 85),
        "posture": random.choice(["good", "fair", "poor"]),
        "stressLevel": random.randint(20, 60),
        "breathingRate": random.randint(12, 20),
        "temperature": round(random.uniform(36.5, 37.2), 1),
    }
    
    # Mock app usage data
    app_usage_data = {
        "recentApps": [
            {"icon": "📝", "name": "VSCode", "category": "focus", "timeSpent": random.randint(30, 90)},
            {"icon": "🌐", "name": "Chrome", "category": "focus", "timeSpent": random.randint(20, 60)},
            {"icon": "🎵", "name": "Spotify", "category": "distraction", "timeSpent": random.randint(10, 30)},
            {"icon": "📱", "name": "Instagram", "category": "distraction", "timeSpent": random.randint(5, 25)},
        ],
        "totalFocusTime": 0,
        "totalDistractionTime": 0,
    }
    
    # Calculate totals
    app_usage_data["totalFocusTime"] = sum(
        app["timeSpent"] for app in app_usage_data["recentApps"] 
        if app["category"] == "focus"
    )
    app_usage_data["totalDistractionTime"] = sum(
        app["timeSpent"] for app in app_usage_data["recentApps"] 
        if app["category"] == "distraction"
    )
    
    # Generate insights based on data
    insights = []
    recommendations = []
    
    if current_confidence < 0.7:
        insights.append({
            "type": "warning",
            "title": "Low confidence in focus detection",
            "description": "Consider adjusting your position or lighting for better tracking"
        })
    
    if biometric_data["stressLevel"] > 50:
        insights.append({
            "type": "warning",
            "title": "Elevated stress levels detected",
            "description": "Your stress level is higher than usual for this time"
        })
        recommendations.append({
            "title": "Take a stress break",
            "description": "Try deep breathing exercises or a short walk"
        })
    
    if app_usage_data["totalDistractionTime"] > app_usage_data["totalFocusTime"] * 0.3:
        insights.append({
            "type": "warning",
            "title": "High distraction time",
            "description": "You're spending significant time on potentially distracting apps"
        })
        recommendations.append({
            "title": "Limit distractions",
            "description": "Consider using focus mode or app blockers during work sessions"
        })
    
    # Add positive insights
    if current_confidence > 0.8:
        insights.append({
            "type": "positive",
            "title": "Excellent focus consistency",
            "description": "You're maintaining high focus levels throughout your session"
        })
    
    if biometric_data["posture"] == "good":
        insights.append({
            "type": "positive",
            "title": "Great posture maintained",
            "description": "You're keeping good ergonomic posture"
        })
    
    # Default recommendations
    if not recommendations:
        recommendations.append({
            "title": "Take regular breaks",
            "description": "Follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds"
        })
    
    return {
        "focusData": {
            "status": current_status,
            "confidence": current_confidence,
            "focusScore": int(current_confidence * 100),
            "focusScoreLabel": "Above average for this time" if current_confidence > 0.7 else "Needs improvement",
            "sessionStart": datetime.utcnow().timestamp() * 1000,
            "time": datetime.utcnow().isoformat(),
        },
        "eyeData": {
            "blinkRate": recent_sessions[0].blink_rate if recent_sessions else 15,
            "gazeDrift": "low" if current_confidence > 0.8 else "medium",
            "eyeStrain": False,
            "lastCalibration": datetime.utcnow().timestamp() * 1000,
        },
        "moodData": {
            "currentMood": random.randint(3, 5),
            "moodHistory": [
                {"value": random.randint(3, 5), "timestamp": (datetime.utcnow() - timedelta(hours=2)).timestamp() * 1000},
                {"value": random.randint(3, 5), "timestamp": (datetime.utcnow() - timedelta(hours=1)).timestamp() * 1000},
                {"value": random.randint(3, 5), "timestamp": datetime.utcnow().timestamp() * 1000},
            ],
            "lastCheck": datetime.utcnow().timestamp() * 1000,
        },
        "biometricData": biometric_data,
        "trendData": {
            "data": trend_data,
            "timeRange": "Today",
            "averageScore": avg_score,
            "trend": trend,
        },
        "appUsageData": app_usage_data,
        "insightsData": {
            "insights": insights,
            "recommendations": recommendations,
            "patterns": [
                {
                    "title": "Peak focus hours",
                    "description": "You're most productive between 9-11 AM and 2-4 PM"
                }
            ],
            "tips": [
                "💡 You tend to be most focused between 9–11 AM and 2–4 PM. Schedule key tasks then."
            ],
        },
    } 