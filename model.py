def predict_focus_state(blink_rate, gaze_direction, app_usage_df):
    """
    Predict focus state based on eye metrics and app usage.
    Args:
        blink_rate (float): Blinks per minute
        gaze_direction (str): 'center', 'left', or 'right'
        app_usage_df (pd.DataFrame): Columns ['app', 'category']
    Returns:
        dict: {'state': str, 'confidence': float, 'reasons': list, 'nudge': str}
    """
    reasons = []
    nudge = ""
    # Rule-based logic
    distraction_apps = app_usage_df[app_usage_df['category'] == 'distraction']
    num_distraction = len(distraction_apps)
    if blink_rate > 25:
        reasons.append(f"High blink rate ({blink_rate:.1f}/min) suggests fatigue or distraction.")
    elif blink_rate < 12:
        reasons.append(f"Low blink rate ({blink_rate:.1f}/min) may indicate high focus or screen strain.")
    else:
        reasons.append(f"Normal blink rate ({blink_rate:.1f}/min).")
    if gaze_direction != 'center':
        reasons.append(f"Gaze is {gaze_direction}, not centered on screen.")
    else:
        reasons.append("Gaze is centered.")
    if num_distraction > 0:
        reasons.append(f"{num_distraction} distraction app(s) detected: {', '.join(distraction_apps['app'])}.")
    else:
        reasons.append("No distraction apps detected.")
    # Simple scoring
    score = 1.0
    if blink_rate > 25 or blink_rate < 12:
        score -= 0.3
    if gaze_direction != 'center':
        score -= 0.3
    if num_distraction > 0:
        score -= 0.2 * num_distraction
    score = max(0, min(1, score))
    # State and nudge
    if score > 0.7:
        state = "focused"
        nudge = "Great job! Keep up the focus."
    elif score > 0.4:
        state = "at risk of distraction"
        nudge = "Consider closing distracting apps and centering your gaze."
    else:
        state = "distracted"
        nudge = "Try a short break, close distractions, and refocus your gaze."
    return {
        'state': state,
        'confidence': round(score, 2),
        'reasons': reasons,
        'nudge': nudge
    } 