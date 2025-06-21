import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000";
const INTERVAL_MS = 5000;

function pad(n) { return n < 10 ? `0${n}` : n; }

function handActivityBadge(hand_activity) {
  if (!hand_activity) return null;
  let color = "bg-gray-300", text = "Idle";
  if (hand_activity.gesture === "fidgeting" || hand_activity.movement === "excessive") {
    color = "bg-red-400"; text = "Fidgeting";
  } else if (hand_activity.gesture === "touching_face") {
    color = "bg-yellow-400"; text = "Touching Face";
  } else if (hand_activity.gesture === "phone") {
    color = "bg-orange-400"; text = "Phone";
  } else if (hand_activity.gesture === "idle") {
    color = "bg-green-400"; text = "Idle";
  }
  return (
    <span className={`inline-block px-3 py-1 rounded text-xs font-semibold text-white ${color} ml-2`}>
      Hand: {text}
    </span>
  );
}

function WarningModal({ onDismiss, hand_activity }) {
  const handDistracted = hand_activity && ["fidgeting", "touching_face", "phone"].includes(hand_activity.gesture);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded shadow-lg p-6 max-w-sm w-full text-center">
        <div className="text-2xl mb-4">⚠️ You seem distracted.</div>
        <div className="mb-6">Want to take a short break?</div>
        {handDistracted && (
          <div className="mb-4 text-red-600 font-semibold">Your hand movement indicates potential distraction.</div>
        )}
        <button className="bg-gray-300 px-4 py-2 rounded mr-2 hover:bg-gray-400" onClick={onDismiss}>Dismiss</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={onDismiss}>Snooze</button>
      </div>
    </div>
  );
}

function WebcamStream({ videoRef }) {
  useEffect(() => {
    let stream;
    navigator.mediaDevices.getUserMedia({ video: true }).then((s) => {
      stream = s;
      if (videoRef.current) videoRef.current.srcObject = stream;
    });
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [videoRef]);
  return null;
}

export default function Home({ setStatusProps }) {
  const videoRef = useRef(null);
  const [prediction, setPrediction] = useState(null);
  const [monitoring, setMonitoring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const intervalRef = useRef(null);
  const [handActivity, setHandActivity] = useState(null);
  const [sessionStart, setSessionStart] = useState(Date.now());

  const handleStartSession = () => {
    setPrediction(null);
    setShowWarning(false);
    setMonitoring(true);
    setSessionStart(Date.now());
  };

  const handleStopSession = () => {
    setMonitoring(false);
    setLoading(false);
    setShowWarning(false);
    setPrediction(null);
    setHandActivity(null);
  };

  const handleDismissWarning = () => {
    setShowWarning(false);
  };

  useEffect(() => {
    if (!monitoring) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    const sendFrame = async () => {
      setLoading(true);
      const video = videoRef.current;
      if (!video) return;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg")
      );
      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");
      try {
        const metricsRes = await axios.post(`${API_URL}/capture`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const metrics = metricsRes.data;
        setHandActivity(metrics.hand_activity);
        // Send metrics to backend for prediction + DB storage
        const predRes = await axios.post(`${API_URL}/predict`, {
          ...metrics,
          hand_activity: metrics.hand_activity
        });
        setPrediction(predRes.data.prediction);
        if (predRes.data.prediction.confidence < 0.5) {
          setShowWarning(true);
        } else {
          setShowWarning(false);
        }
        // Update statusProps in App.jsx
        setStatusProps({
          status: predRes.data.prediction.state,
          confidence: predRes.data.prediction.confidence,
          focusScore: Math.round(predRes.data.prediction.confidence * 100),
          focusScoreLabel: predRes.data.prediction.state === 'focused' ? 'Above average for this time' : predRes.data.prediction.state === 'at risk of distraction' ? 'Keep an eye on your focus' : 'Needs improvement',
          sessionStart: sessionStart,
          time: new Date(),
          blinkRate: metrics.blink_rate,
        });
      } catch (err) {
        // Optionally handle error
      }
      setLoading(false);
    };
    sendFrame();
    intervalRef.current = setInterval(sendFrame, INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [monitoring, sessionStart, setStatusProps]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Focus Monitoring</h1>
        <p className="text-gray-600">Real-time focus tracking with webcam analysis</p>
      </div>
      
      <div className="flex flex-col items-center gap-6">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          width={320}
          height={240}
          className="rounded-lg shadow-lg"
          style={{ background: "#222" }}
        />
        
        <div className="flex gap-4">
          {!monitoring ? (
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              onClick={handleStartSession}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Start Monitoring"}
            </button>
          ) : (
            <button
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              onClick={handleStopSession}
            >
              Stop Monitoring
            </button>
          )}
        </div>

        {prediction && (
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Prediction: {prediction.state}</h2>
              {handActivityBadge(prediction.hand_activity)}
            </div>
            <p className="mb-3 text-gray-600">Confidence: <span className="font-bold text-blue-600">{Math.round(prediction.confidence * 100)}%</span></p>
            <ul className="mb-4 space-y-1">
              {prediction.reasons.map((r, i) => (
                <li key={i} className="text-gray-700">• {r}</li>
              ))}
            </ul>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <p className="text-blue-800 font-medium">{prediction.nudge}</p>
            </div>
          </div>
        )}

        {showWarning && (
          <WarningModal
            onDismiss={handleDismissWarning}
            hand_activity={prediction?.hand_activity}
          />
        )}
      </div>
      
      <WebcamStream videoRef={videoRef} />
    </div>
  );
}
