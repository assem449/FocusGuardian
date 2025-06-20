import React from "react";

function pad(n) { return n < 10 ? `0${n}` : n; }

function formatTime(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
}

function formatDuration(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

export default function TopStatusBar({ status, confidence, focusScore, focusScoreLabel, sessionStart, time }) {
  const duration = formatDuration(time - sessionStart);
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm h-20 flex items-center px-8 justify-between">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold text-blue-700 tracking-tight">🛡️ Focus Guardian</span>
        <span className="text-gray-500 text-sm">{formatTime(time)} • Monitoring your focus patterns</span>
        <span className="text-gray-400 text-xs ml-2">Session: {duration}</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-gray-700">Status: <span className={`font-bold ${status === 'focused' ? 'text-green-600' : status === 'at risk of distraction' ? 'text-yellow-600' : 'text-red-600'}`}>{status}</span></span>
          <span className="text-xs text-gray-500">Confidence: <b>{Math.round(confidence * 100)}%</b></span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-gray-700">Focus Score: <span className="font-bold text-blue-700">{focusScore}</span></span>
          <span className="text-xs text-gray-500">{focusScoreLabel}</span>
        </div>
      </div>
    </header>
  );
} 