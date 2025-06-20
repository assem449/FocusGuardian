import cv2
import mediapipe as mp
import numpy as np

def analyze_hand_activity(frame):
    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.5)
    mp_drawing = mp.solutions.drawing_utils
    results = hands.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    hand_activity = {
        'visible': False,
        'movement': 'none',
        'gesture': 'idle'
    }
    if results.multi_hand_landmarks:
        hand_activity['visible'] = True
        # For demo: randomize gesture for now
        gesture = np.random.choice(['idle', 'touching_face', 'phone', 'fidgeting'])
        hand_activity['gesture'] = gesture
        # Simulate movement
        movement = np.random.choice(['none', 'mild', 'excessive'])
        hand_activity['movement'] = movement
    return hand_activity

def extract_metrics_from_frame(frame_bytes):
    # Decode frame
    nparr = np.frombuffer(frame_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    # Simulate eye/head metrics
    blink_rate = np.random.uniform(10, 30)
    gaze_direction = np.random.choice(['center', 'left', 'right'])
    head_pose = np.random.choice(['straight', 'tilted_left', 'tilted_right'])
    hand_activity = analyze_hand_activity(frame)
    return {
        "blink_rate": blink_rate,
        "gaze_direction": gaze_direction,
        "head_pose": head_pose,
        "hand_activity": hand_activity
    } 