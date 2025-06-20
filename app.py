import streamlit as st
import pandas as pd
from webcam import get_eye_metrics
from data_logger import get_app_usage
from model import predict_focus_state

st.set_page_config(page_title="Focus Guardian", layout="centered")
st.title("🛡️ Focus Guardian")
st.write("Check your current focus state using webcam and app usage simulation.")

if 'result' not in st.session_state:
    st.session_state['result'] = None

if st.button("Check My Focus"):
    blink_rate, gaze_direction = get_eye_metrics()
    app_usage = get_app_usage()
    result = predict_focus_state(blink_rate, gaze_direction, app_usage)
    st.session_state['result'] = {
        'blink_rate': blink_rate,
        'gaze_direction': gaze_direction,
        'app_usage': app_usage,
        'prediction': result
    }

if st.session_state['result']:
    res = st.session_state['result']
    st.subheader(f"Prediction: {res['prediction']['state'].capitalize()}")
    st.metric("Confidence", f"{res['prediction']['confidence']*100:.0f}%")
    st.write("**Reasons:**")
    for reason in res['prediction']['reasons']:
        st.write(f"- {reason}")
    st.write("**Smart Advice:**")
    st.info(res['prediction']['nudge'])
    st.write("---")
    st.write("**Details:**")
    st.write(f"Blink rate: {res['blink_rate']:.1f} blinks/min")
    st.write(f"Gaze direction: {res['gaze_direction']}")
    st.write("App usage log:")
    st.dataframe(res['app_usage'], hide_index=True) 