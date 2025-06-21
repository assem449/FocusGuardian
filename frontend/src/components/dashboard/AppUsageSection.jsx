import React from "react";

export default function AppUsageSection({ appUsageData }) {
  const { recentApps, totalFocusTime, totalDistractionTime } = appUsageData;

  const getCategoryColor = (category) => {
    switch (category) {
      case "focus":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "distraction":
        return "bg-red-100 text-red-700 border-red-200";
      case "neutral":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">App Usage (Last 2 Hours)</h2>
        <span className="text-2xl">📱</span>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-600 font-medium">Focus Time</p>
            <p className="text-xl font-bold text-blue-700">{formatTime(totalFocusTime)}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-sm text-red-600 font-medium">Distraction Time</p>
            <p className="text-xl font-bold text-red-700">{formatTime(totalDistractionTime)}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {recentApps.map((app, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-xl">{app.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{app.name}</p>
                  <p className="text-sm text-gray-500">{app.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(app.category)}`}>
                  {app.category}
                </span>
                <span className="text-sm font-medium text-gray-700">{formatTime(app.timeSpent)}</span>
              </div>
            </div>
          ))}
        </div>
        
        {recentApps.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No app usage data available</p>
          </div>
        )}
      </div>
    </div>
  );
} 