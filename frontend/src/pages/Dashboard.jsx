import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const mockFocusTrend = {
  labels: ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"],
  datasets: [
    {
      label: "Focus Score",
      data: [70, 75, 80, 65, 60, 72, 78, 74],
      borderColor: "#2563eb",
      backgroundColor: "rgba(37,99,235,0.1)",
      tension: 0.4,
      fill: true,
    },
  ],
};

const mockAppUsage = [
  { icon: "📝", name: "VSCode", category: "focus", time: "1h 10m" },
  { icon: "🌐", name: "Chrome", category: "focus", time: "45m" },
  { icon: "🎵", name: "Spotify", category: "distraction", time: "20m" },
  { icon: "📱", name: "Instagram", category: "distraction", time: "15m" },
];

const mockInsights = [
  "High app switching frequency detected",
  "Gaze off-screen for 3+ minutes at 1:30 PM",
];

const mockTip =
  "💡 You tend to be most focused between 9–11 AM and 2–4 PM. Schedule key tasks then.";

export default function Dashboard({ dashboardState, setDashboardState }) {
  const [mood, setMood] = useState(3);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Focus Trend */}
      <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-blue-700">Focus Trend Today</h2>
        </div>
        <Line data={mockFocusTrend} options={{
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { min: 0, max: 100 } },
        }} height={80} />
      </div>
      {/* Eye Tracking Metrics */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
        <h2 className="text-lg font-bold mb-2">Eye Tracking Metrics</h2>
        <div>Blink rate: <b>{dashboardState.blinkRate}</b> /min</div>
        <div>Gaze drift: <b>Low</b></div>
      </div>
      {/* Mood Check */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
        <h2 className="text-lg font-bold mb-2">Mood Check</h2>
        <div className="flex items-center gap-2">
          <input type="range" min={1} max={5} value={mood} onChange={e => setMood(Number(e.target.value))} className="w-full" />
          <span className="text-2xl">{["😞","😕","😐","🙂","😃"][mood-1]}</span>
        </div>
      </div>
      {/* App Usage */}
      <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
        <h2 className="text-lg font-bold mb-2">App Usage (Last 2 Hours)</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500">
              <th className="text-left">Icon</th>
              <th className="text-left">App</th>
              <th className="text-left">Category</th>
              <th className="text-left">Time Spent</th>
            </tr>
          </thead>
          <tbody>
            {mockAppUsage.map((app, i) => (
              <tr key={i} className="border-t">
                <td>{app.icon}</td>
                <td>{app.name}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${app.category === "focus" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-600"}`}>{app.category}</span>
                </td>
                <td>{app.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Focus Insights */}
      <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
        <h2 className="text-lg font-bold mb-2">Focus Insights</h2>
        <ul className="mb-2 list-disc pl-5">
          {mockInsights.map((ins, i) => (
            <li key={i}>{ins}</li>
          ))}
        </ul>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded text-blue-800">{mockTip}</div>
      </div>
    </div>
  );
} 