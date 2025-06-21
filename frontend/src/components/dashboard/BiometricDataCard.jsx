import React from "react";

export default function BiometricDataCard({ biometricData }) {
  const { heartRate, posture, stressLevel, breathingRate, temperature } = biometricData;

  const getHeartRateStatus = (rate) => {
    if (rate < 60) return { status: "Low", color: "text-blue-600", bg: "bg-blue-50" };
    if (rate > 100) return { status: "High", color: "text-red-600", bg: "bg-red-50" };
    return { status: "Normal", color: "text-green-600", bg: "bg-green-50" };
  };

  const getPostureStatus = (posture) => {
    switch (posture) {
      case "good":
        return { status: "Good", color: "text-green-600", bg: "bg-green-50" };
      case "fair":
        return { status: "Fair", color: "text-yellow-600", bg: "bg-yellow-50" };
      case "poor":
        return { status: "Poor", color: "text-red-600", bg: "bg-red-50" };
      default:
        return { status: "Unknown", color: "text-gray-600", bg: "bg-gray-50" };
    }
  };

  const getStressLevelStatus = (level) => {
    if (level < 30) return { status: "Low", color: "text-green-600", bg: "bg-green-50" };
    if (level > 70) return { status: "High", color: "text-red-600", bg: "bg-red-50" };
    return { status: "Moderate", color: "text-yellow-600", bg: "bg-yellow-50" };
  };

  const getHealthTip = (stressLevel, posture) => {
    if (stressLevel > 70) {
      return "Consider taking a short break to reduce stress levels.";
    }
    if (posture === "poor") {
      return "Try to sit up straight and maintain good posture.";
    }
    return "Your biometrics are looking good! Keep up the healthy habits.";
  };

  const heartRateStatus = getHeartRateStatus(heartRate);
  const postureStatus = getPostureStatus(posture);
  const stressStatus = getStressLevelStatus(stressLevel);
  const healthTip = getHealthTip(stressLevel, posture);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Biometric Data</h2>
        <span className="text-2xl">💓</span>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Heart Rate */}
          <div className="bg-red-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-red-600 font-medium">Heart Rate</p>
              <span className="text-lg">❤️</span>
            </div>
            <p className="text-2xl font-bold text-red-700">{heartRate} BPM</p>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${heartRateStatus.bg} ${heartRateStatus.color}`}>
              {heartRateStatus.status}
            </div>
          </div>

          {/* Stress Level */}
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-purple-600 font-medium">Stress Level</p>
              <span className="text-lg">😰</span>
            </div>
            <p className="text-2xl font-bold text-purple-700">{stressLevel}%</p>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stressStatus.bg} ${stressStatus.color}`}>
              {stressStatus.status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Posture */}
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-green-600 font-medium">Posture</p>
              <span className="text-lg">🧍</span>
            </div>
            <p className="text-lg font-bold text-green-700 capitalize">{posture}</p>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${postureStatus.bg} ${postureStatus.color}`}>
              {postureStatus.status}
            </div>
          </div>

          {/* Breathing Rate */}
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-blue-600 font-medium">Breathing</p>
              <span className="text-lg">🫁</span>
            </div>
            <p className="text-lg font-bold text-blue-700">{breathingRate}/min</p>
            <p className="text-xs text-blue-600">Respiratory rate</p>
          </div>
        </div>

        {/* Temperature */}
        {temperature && (
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Body Temperature</p>
                <p className="text-lg font-bold text-orange-700">{temperature}°C</p>
              </div>
              <span className="text-2xl">🌡️</span>
            </div>
          </div>
        )}

        {/* Health Tips */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Health Tip:</span> {healthTip}
          </p>
        </div>
      </div>
    </div>
  );
} 