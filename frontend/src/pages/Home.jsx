import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000";
const INTERVAL_MS = 5000;

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

export default function Home() {
  const videoRef = useRef(null);
  const [prediction, setPrediction] = useState(null);
  const [monitoring, setMonitoring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const intervalRef = useRef(null);
  const [handActivity, setHandActivity] = useState(null);

  // Start or stop monitoring
  const handleStartSession = () => {
    setPrediction(null);
    setShowWarning(false);
    setMonitoring(true);
  };

  const handleStopSession = () => {
    setMonitoring(false);
    setLoading(false);
    setShowWarning(false);
    setPrediction(null);
    setHandActivity(null);
  };

  // Monitoring loop
  useEffect(() => {
    if (!monitoring) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    const sendFrame = async () => {
      setLoading(true);
      // Get frame from webcam
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
      // Send frame to backend for metrics
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
      } catch (err) {
        // Optionally handle error
      }
      setLoading(false);
    };
    // Send first frame immediately
    sendFrame();
    intervalRef.current = setInterval(sendFrame, INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [monitoring]);

  return (
    <div className="flex flex-col items-center gap-6">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        width={320}
        height={240}
        className="rounded shadow"
        style={{ background: "#222" }}
      />
      <div className="flex gap-4">
        {!monitoring ? (
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
            onClick={handleStartSession}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Start Session"}
          </button>
        ) : (
          <button
            className="bg-red-600 text-white px-6 py-2 rounded font-semibold hover:bg-red-700"
            onClick={handleStopSession}
          >
            Stop Monitoring
          </button>
        )}
      </div>
      {prediction && (
        <div className="w-full bg-white rounded shadow p-4 mt-4">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-bold">Prediction: {prediction.state}</h2>
            {handActivityBadge(prediction.hand_activity)}
          </div>
          <p className="mb-1">Confidence: <b>{Math.round(prediction.confidence * 100)}%</b></p>
          <ul className="mb-2">
            {prediction.reasons.map((r, i) => (
              <li key={i}>- {r}</li>
            ))}
          </ul>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-2">{prediction.nudge}</div>
        </div>
      )}
      <WebcamStream videoRef={videoRef} />
      {showWarning && (
        <WarningModal onDismiss={() => setShowWarning(false)} hand_activity={prediction?.hand_activity} />
      )}
    </div>
  );
}

function WebcamStream({ videoRef }) {
  useEffect(() => {
    let stream;
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((s) => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [videoRef]);
  return null;
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
        <button
          className="bg-gray-300 px-4 py-2 rounded mr-2 hover:bg-gray-400"
          onClick={onDismiss}
        >
          Dismiss
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={onDismiss}
        >
          Snooze
        </button>
      </div>
    </div>
  );
} 