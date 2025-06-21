import React from "react";

export default function FocusTrendChart({ trendData }) {
  const { data, timeRange, averageScore, trend } = trendData;

  // Simple chart rendering without external dependencies
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const getYPosition = (value) => {
    if (range === 0) return 50;
    return 100 - ((value - minValue) / range) * 80;
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "improving":
        return "📈";
      case "declining":
        return "📉";
      case "stable":
        return "➡️";
      default:
        return "📊";
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case "improving":
        return "text-green-600";
      case "declining":
        return "text-red-600";
      case "stable":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Focus Trend</h2>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getTrendIcon(trend)}</span>
          <span className={`text-sm font-medium ${getTrendColor(trend)}`}>
            {trend}
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Average</p>
            <p className="text-xl font-bold text-blue-600">{Math.round(averageScore)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Peak</p>
            <p className="text-xl font-bold text-green-600">{Math.round(maxValue)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Low</p>
            <p className="text-xl font-bold text-red-600">{Math.round(minValue)}</p>
          </div>
        </div>

        {/* Simple SVG Chart */}
        <div className="relative h-32 bg-gray-50 rounded-lg p-4">
          <svg width="100%" height="100%" className="absolute inset-0">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={`${y}%`}
                x2="100%"
                y2={`${y}%`}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            
            {/* Data line */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              points={data.map((d, i) => {
                const x = (i / (data.length - 1)) * 100;
                const y = getYPosition(d.value);
                return `${x},${y}`;
              }).join(" ")}
            />
            
            {/* Data points */}
            {data.map((d, i) => {
              const x = (i / (data.length - 1)) * 100;
              const y = getYPosition(d.value);
              return (
                <circle
                  key={i}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="3"
                  fill="#3b82f6"
                />
              );
            })}
          </svg>
        </div>

        {/* Time labels */}
        <div className="flex justify-between text-xs text-gray-500">
          {data.map((d, i) => (
            <span key={i}>{d.time}</span>
          ))}
        </div>

        <div className="text-xs text-gray-400 text-center">
          {timeRange} • {data.length} data points
        </div>
      </div>
    </div>
  );
} 