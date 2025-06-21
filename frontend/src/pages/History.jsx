import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/history`).then((res) => setHistory(res.data));
  }, []);

  return (
      <div>
        <h2 className="text-2xl font-bold mb-4">📚 Session History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Blink Rate</th>
                <th className="px-3 py-2">Gaze</th>
                <th className="px-3 py-2">Head Pose</th>
                <th className="px-3 py-2">Prediction</th>
                <th className="px-3 py-2">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {history.map((s, i) => (
                <tr key={i} className="border-t">
                  <td className="px-3 py-2">{new Date(s.timestamp).toLocaleString()}</td>
                  <td className="px-3 py-2">{s.blink_rate.toFixed(1)}</td>
                  <td className="px-3 py-2">{s.gaze_direction}</td>
                  <td className="px-3 py-2">{s.head_pose}</td>
                  <td className="px-3 py-2">{s.prediction}</td>
                  <td className="px-3 py-2">{Math.round(s.confidence * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}
