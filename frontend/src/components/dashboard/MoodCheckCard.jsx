import React, { useState } from "react";

export default function MoodCheckCard({ moodData, onMoodChange }) {
  const { currentMood, moodHistory, lastCheck } = moodData;
  const [selectedMood, setSelectedMood] = useState(currentMood || 3);

  const moods = [
    { value: 1, emoji: "😞", label: "Very Low" },
    { value: 2, emoji: "😕", label: "Low" },
    { value: 3, emoji: "😐", label: "Neutral" },
    { value: 4, emoji: "🙂", label: "Good" },
    { value: 5, emoji: "😃", label: "Excellent" },
  ];

  const handleMoodSelect = (moodValue) => {
    setSelectedMood(moodValue);
    if (onMoodChange) {
      onMoodChange(moodValue);
    }
  };

  const getMoodTrend = () => {
    if (!moodHistory || moodHistory.length < 2) return null;
    const recent = moodHistory.slice(-3);
    const avg = recent.reduce((sum, m) => sum + m.value, 0) / recent.length;
    if (avg > selectedMood) return "declining";
    if (avg < selectedMood) return "improving";
    return "stable";
  };

  const moodTrend = getMoodTrend();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Mood Check</h2>
        <span className="text-2xl">😊</span>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-3">How are you feeling right now?</p>
          <div className="flex justify-between items-center">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => handleMoodSelect(mood.value)}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  selectedMood === mood.value
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-50"
                }`}
              >
                <span className="text-2xl mb-1">{mood.emoji}</span>
                <span className="text-xs text-gray-600">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {moodTrend && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Mood trend:</span>{" "}
              <span className={`font-medium ${
                moodTrend === "improving" ? "text-green-600" :
                moodTrend === "declining" ? "text-red-600" : "text-gray-600"
              }`}>
                {moodTrend}
              </span>
            </p>
          </div>
        )}
        
        <div className="text-xs text-gray-400">
          Last checked: {lastCheck ? new Date(lastCheck).toLocaleTimeString() : "Never"}
        </div>
      </div>
    </div>
  );
} 