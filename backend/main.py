from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal, init_db, Session as DBSession
from webcam_utils import extract_metrics_from_frame
from ml_model import predict_focus_state
from datetime import datetime
import numpy as np

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