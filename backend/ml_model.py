def predict_focus_state(blink_rate, gaze_direction, head_pose, hand_activity):
    reasons = []
    score = 1.0
    hand_contrib = False

    if blink_rate > 25:
        reasons.append("High blink rate suggests fatigue or distraction.")
        score -= 0.3
    elif blink_rate < 12:
        reasons.append("Low blink rate may indicate high focus or screen strain.")
        score -= 0.1
    else:
        reasons.append("Normal blink rate.")

    if gaze_direction != 'center':
        reasons.append(f"Gaze is {gaze_direction}, not centered.")
        score -= 0.3
    else:
        reasons.append("Gaze is centered.")

    if head_pose != 'straight':
        reasons.append(f"Head pose is {head_pose}.")
        score -= 0.2
    else:
        reasons.append("Head is straight.")

    # Hand activity logic
    if hand_activity:
        gesture = hand_activity.get('gesture', 'idle')
        movement = hand_activity.get('movement', 'none')
        if gesture in ['fidgeting', 'touching_face', 'phone']:
            reasons.append(f"Hand gesture detected: {gesture}.")
            score -= 0.2
            hand_contrib = True
        if movement == 'excessive':
            reasons.append("Excessive hand movement detected.")
            score -= 0.15
            hand_contrib = True
        if gesture == 'idle' and movement in ['none', 'mild']:
            reasons.append("Hand activity appears normal.")
    score = max(0, min(1, score))
    if score > 0.7:
        state = "focused"
        nudge = "Great job! Keep up the focus."
    elif score > 0.4:
        state = "at risk of distraction"
        nudge = "Try to center your gaze, head, and hands."
    else:
        state = "distracted"
        nudge = "Take a break and refocus."
        if hand_contrib:
            nudge += " Your hand movement indicates potential distraction."
    return {
        "state": state,
        "confidence": round(score, 2),
        "reasons": reasons,
        "nudge": nudge,
        "hand_activity": hand_activity
    } 