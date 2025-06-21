import React from "react";

export default function FocusStatusCard({ focusData }) {
  const { status, confidence, focusScore, focusScoreLabel, sessionStart, time } = focusData;

  const getStatusColor = (status) => {
    switch (status) {
      case "focused":
        return "text-green-600 bg-green-50 border-green-200";
      case "at risk of distraction":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "distracted":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "focused":
        return "🎯";
      case "at risk of distraction":
        return "⚠️";
      case "distracted":
        return "😵";
      default:
        return "⏸️";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Focus Status</h2>
        <span className="text-2xl">{getStatusIcon(status)}</span>
      </div>
      
      <div className="space-y-4">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
          {status}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Focus Score</p>
            <p className="text-2xl font-bold text-blue-600">{focusScore}</p>
            <p className="text-xs text-gray-400">{focusScoreLabel}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Confidence</p>
            <p className="text-2xl font-bold text-gray-900">{Math.round(confidence * 100)}%</p>
            <p className="text-xs text-gray-400">Model accuracy</p>
          </div>
        </div>
      </div>
    </div>
  );
} 