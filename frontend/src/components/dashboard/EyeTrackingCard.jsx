import React from "react";

export default function EyeTrackingCard({ eyeData }) {
  const { blinkRate, gazeDrift, eyeStrain, lastCalibration } = eyeData;

  const getBlinkRateStatus = (rate) => {
    if (rate < 10) return { status: "Low", color: "text-yellow-600", bg: "bg-yellow-50" };
    if (rate > 25) return { status: "High", color: "text-red-600", bg: "bg-red-50" };
    return { status: "Normal", color: "text-green-600", bg: "bg-green-50" };
  };

  const getGazeDriftStatus = (drift) => {
    if (drift === "low") return { status: "Stable", color: "text-green-600", bg: "bg-green-50" };
    if (drift === "medium") return { status: "Moderate", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { status: "High", color: "text-red-600", bg: "bg-red-50" };
  };

  const blinkStatus = getBlinkRateStatus(blinkRate);
  const gazeStatus = getGazeDriftStatus(gazeDrift);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Eye Tracking</h2>
        <span className="text-2xl">👁️</span>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Blink Rate</p>
            <p className="text-2xl font-bold text-gray-900">{blinkRate}/min</p>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${blinkStatus.bg} ${blinkStatus.color}`}>
              {blinkStatus.status}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gaze Drift</p>
            <p className="text-2xl font-bold text-gray-900 capitalize">{gazeDrift}</p>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${gazeStatus.bg} ${gazeStatus.color}`}>
              {gazeStatus.status}
            </div>
          </div>
        </div>
        
        {eyeStrain && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Eye Strain Alert:</span> Consider taking a 20-second break to look at something 20 feet away
            </p>
          </div>
        )}
        
        <div className="text-xs text-gray-400">
          Last calibrated: {lastCalibration ? new Date(lastCalibration).toLocaleDateString() : "Never"}
        </div>
      </div>
    </div>
  );
} 