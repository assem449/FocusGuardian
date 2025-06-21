import React, { useState, useEffect } from "react";
import axios from "axios";
import Home from "./pages/Home";
import History from "./pages/History";
import Dashboard from "./pages/Dashboard";
import TopStatusBar from "./components/TopStatusBar";
import QuickActionsBar from "./components/QuickActionsBar";

const API_URL = "http://localhost:8000";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [statusProps, setStatusProps] = useState({
    status: "Not started",
    confidence: 1,
    focusScore: 0,
    focusScoreLabel: "Session not started",
    sessionStart: Date.now(),
    time: new Date(),
    blinkRate: 0,
  });

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data from backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/dashboard`);
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
      // Fallback to mock data if API fails
      setDashboardData({
        focusData: {
          status: "focused",
          confidence: 0.85,
          focusScore: 85,
          focusScoreLabel: "Above average for this time",
          sessionStart: Date.now(),
          time: new Date(),
        },
        eyeData: {
          blinkRate: 15,
          gazeDrift: "low",
          eyeStrain: false,
          lastCalibration: Date.now(),
        },
        moodData: {
          currentMood: 4,
          moodHistory: [
            { value: 3, timestamp: Date.now() - 3600000 },
            { value: 4, timestamp: Date.now() - 1800000 },
            { value: 4, timestamp: Date.now() },
          ],
          lastCheck: Date.now(),
        },
        biometricData: {
          heartRate: 72,
          posture: "good",
          stressLevel: 35,
          breathingRate: 16,
          temperature: 36.8,
        },
        trendData: {
          data: [
            { time: "9AM", value: 70 },
            { time: "10AM", value: 75 },
            { time: "11AM", value: 80 },
            { time: "12PM", value: 65 },
            { time: "1PM", value: 60 },
            { time: "2PM", value: 72 },
            { time: "3PM", value: 78 },
            { time: "4PM", value: 74 },
          ],
          timeRange: "Today",
          averageScore: 72,
          trend: "improving",
        },
        appUsageData: {
          recentApps: [
            { icon: "📝", name: "VSCode", category: "focus", timeSpent: 70 },
            { icon: "🌐", name: "Chrome", category: "focus", timeSpent: 45 },
            { icon: "🎵", name: "Spotify", category: "distraction", timeSpent: 20 },
            { icon: "📱", name: "Instagram", category: "distraction", timeSpent: 15 },
          ],
          totalFocusTime: 115,
          totalDistractionTime: 35,
        },
        insightsData: {
          insights: [
            {
              type: "positive",
              title: "Great focus consistency",
              description: "You've maintained focus for 85% of your session time",
            },
            {
              type: "warning",
              title: "High app switching",
              description: "Consider reducing context switching to improve productivity",
            },
          ],
          recommendations: [
            {
              title: "Take regular breaks",
              description: "Try the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds",
            },
            {
              title: "Optimize your workspace",
              description: "Ensure proper lighting and ergonomics for better focus",
            },
          ],
          patterns: [
            {
              title: "Peak focus hours",
              description: "You're most productive between 9-11 AM and 2-4 PM",
            },
          ],
          tips: [
            "💡 You tend to be most focused between 9–11 AM and 2–4 PM. Schedule key tasks then.",
          ],
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when switching to dashboard
  useEffect(() => {
    if (page === "dashboard") {
      fetchDashboardData();
    }
  }, [page]);

  // Update status props when dashboard data changes
  useEffect(() => {
    if (dashboardData?.focusData) {
      setStatusProps({
        status: dashboardData.focusData.status,
        confidence: dashboardData.focusData.confidence,
        focusScore: dashboardData.focusData.focusScore,
        focusScoreLabel: dashboardData.focusData.focusScoreLabel,
        sessionStart: dashboardData.focusData.sessionStart,
        time: new Date(dashboardData.focusData.time),
        blinkRate: dashboardData.eyeData?.blinkRate || 0,
      });
    }
  }, [dashboardData]);

  const handleMoodChange = (newMood) => {
    setDashboardData(prev => ({
      ...prev,
      moodData: {
        ...prev.moodData,
        currentMood: newMood,
        lastCheck: Date.now(),
      }
    }));
  };

  const handleQuickAction = (actionId) => {
    console.log(`Quick action triggered: ${actionId}`);
    // Handle different quick actions
    switch (actionId) {
      case "take-break":
        // Implement break functionality
        break;
      case "block-distractions":
        // Implement distraction blocking
        break;
      case "start-pomodoro":
        // Implement Pomodoro timer
        break;
      case "eye-exercise":
        // Implement eye exercise reminder
        break;
      case "posture-check":
        // Implement posture check
        break;
      default:
        break;
    }
  };

  if (loading && page === "dashboard") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <TopStatusBar
        {...statusProps}
        page={page}
        setPage={setPage}
      />
      <div className="flex flex-col min-h-screen bg-gray-50 pt-20 pb-16">
        <main className="flex-1">
          {page === "dashboard" ? (
            dashboardData ? (
              <Dashboard 
                dashboardData={dashboardData}
                onMoodChange={handleMoodChange}
                onQuickAction={handleQuickAction}
              />
            ) : (
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <p className="text-red-600 mb-4">{error || "Failed to load dashboard"}</p>
                  <button 
                    onClick={fetchDashboardData}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )
          ) : page === "home" ? (
            <Home setStatusProps={setStatusProps} />
          ) : (
            <History />
          )}
        </main>
      </div>
      <QuickActionsBar onAction={handleQuickAction} />
    </>
  );
}
