import random

def get_eye_metrics():
    """
    Simulate capturing blink rate and gaze direction from webcam.
    Returns:
        blink_rate (float): Blinks per minute
        gaze_direction (str): 'center', 'left', or 'right'
    """
    blink_rate = random.uniform(10, 30)  # Simulate normal blink rate
    gaze_direction = random.choice(['center', 'left', 'right'])
    return blink_rate, gaze_direction 