import React, { useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";
import TopStatusBar from "./components/TopStatusBar";
import BottomActionsBar from "./components/BottomActionsBar";

export default function App() {
  const [statusProps, setStatusProps] = useState({
    status: "focused",
    confidence: 1,
    focusScore: 100,
    focusScoreLabel: "Session not started",
    sessionStart: Date.now(),
    time: new Date(),
    blinkRate: 0,
  });

  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = location.pathname === "/history" ? "history" : "home";

  return (
    <>
      <TopStatusBar
        {...statusProps}
        page={currentPage}
        setPage={(p) => navigate(p === "home" ? "/" : "/history")}
      />
      <div className="flex flex-col min-h-screen bg-gray-50 pt-20 pb-16">
        <main className="flex-1 w-full max-w-5xl mx-auto px-4">
          <Routes>
            <Route path="/" element={<Home setStatusProps={setStatusProps} />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
      <BottomActionsBar />
    </>
  );
}
