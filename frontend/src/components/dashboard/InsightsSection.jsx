import React from "react";

export default function InsightsSection({ insightsData }) {
  const { insights, recommendations, patterns, tips } = insightsData;

  const getInsightTypeColor = (type) => {
    switch (type) {
      case "positive":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "improvement":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Insights & Recommendations</h2>
        <span className="text-2xl">💡</span>
      </div>
      
      <div className="space-y-6">
        {/* Key Insights */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-3">Key Insights</h3>
          <div className="space-y-2">
            {insights.map((insight, index) => (
              <div key={index} className={`p-3 rounded-lg border ${getInsightTypeColor(insight.type)}`}>
                <p className="text-sm font-medium">{insight.title}</p>
                <p className="text-xs mt-1">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Behavioral Patterns */}
        {patterns && patterns.length > 0 && (
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-3">Behavioral Patterns</h3>
            <div className="space-y-2">
              {patterns.map((pattern, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-900">{pattern.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{pattern.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-3">Recommendations</h3>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-900">{rec.title}</p>
                  <p className="text-xs text-blue-700 mt-1">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Tip */}
        {tips && tips.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-md font-medium text-blue-900 mb-2">💡 Daily Tip</h3>
            <p className="text-sm text-blue-800">{tips[0]}</p>
          </div>
        )}
      </div>
    </div>
  );
} 