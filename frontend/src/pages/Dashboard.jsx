import React, { useState } from "react";
import FocusStatusCard from "../components/dashboard/FocusStatusCard";
import EyeTrackingCard from "../components/dashboard/EyeTrackingCard";
import MoodCheckCard from "../components/dashboard/MoodCheckCard";
import AppUsageSection from "../components/dashboard/AppUsageSection";
import InsightsSection from "../components/dashboard/InsightsSection";
import FocusTrendChart from "../components/dashboard/FocusTrendChart";
import BiometricDataCard from "../components/dashboard/BiometricDataCard";

export default function Dashboard({ dashboardData, onMoodChange, onQuickAction }) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "focus", label: "Focus", icon: "🎯" },
    { id: "health", label: "Health", icon: "💓" },
    { id: "insights", label: "Insights", icon: "💡" },
  ];

  const getTabDescription = (tabId) => {
    switch (tabId) {
      case "overview":
        return "Get a complete overview of your focus and health metrics";
      case "focus":
        return "Track your focus patterns and eye tracking data";
      case "health":
        return "Monitor your biometric data and wellness metrics";
      case "insights":
        return "Discover insights and recommendations for better focus";
      default:
        return "";
    }
  };

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <FocusStatusCard focusData={dashboardData.focusData} />
      <EyeTrackingCard eyeData={dashboardData.eyeData} />
      <MoodCheckCard moodData={dashboardData.moodData} onMoodChange={onMoodChange} />
      <BiometricDataCard biometricData={dashboardData.biometricData} />
      <div className="md:col-span-2 lg:col-span-2">
        <FocusTrendChart trendData={dashboardData.trendData} />
      </div>
    </div>
  );

  const renderFocusTab = () => (
    <div className="space-y-6">
      <FocusStatusCard focusData={dashboardData.focusData} />
      <FocusTrendChart trendData={dashboardData.trendData} />
      <EyeTrackingCard eyeData={dashboardData.eyeData} />
    </div>
  );

  const renderHealthTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BiometricDataCard biometricData={dashboardData.biometricData} />
      <EyeTrackingCard eyeData={dashboardData.eyeData} />
      <MoodCheckCard moodData={dashboardData.moodData} onMoodChange={onMoodChange} />
    </div>
  );

  const renderInsightsTab = () => (
    <div className="space-y-6">
      <InsightsSection insightsData={dashboardData.insightsData} />
      <AppUsageSection appUsageData={dashboardData.appUsageData} />
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "focus":
        return renderFocusTab();
      case "health":
        return renderHealthTab();
      case "insights":
        return renderInsightsTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {tabs.find(tab => tab.id === activeTab)?.label} Dashboard
          </h1>
          <p className="text-gray-600">
            {getTabDescription(activeTab)}
          </p>
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
} 