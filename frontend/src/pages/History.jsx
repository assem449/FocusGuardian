import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:8000";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/history`).then((res) => setHistory(res.data));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Session History</h2>
        <Link to="/" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-2 py-1">Time</th>
              <th className="px-2 py-1">Blink Rate</th>
              <th className="px-2 py-1">Gaze</th>
              <th className="px-2 py-1">Head Pose</th>
              <th className="px-2 py-1">Prediction</th>
              <th className="px-2 py-1">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {history.map((s, i) => (
              <tr key={i}>
                <td className="px-2 py-1">{new Date(s.timestamp).toLocaleString()}</td>
                <td className="px-2 py-1">{s.blink_rate.toFixed(1)}</td>
                <td className="px-2 py-1">{s.gaze_direction}</td>
                <td className="px-2 py-1">{s.head_pose}</td>
                <td className="px-2 py-1">{s.prediction}</td>
                <td className="px-2 py-1">{Math.round(s.confidence * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 