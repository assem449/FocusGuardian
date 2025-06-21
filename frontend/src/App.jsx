import React, { useState } from "react";
import Home from "./pages/Home";
import History from "./pages/History";
import TopStatusBar from "./components/TopStatusBar";
import BottomActionsBar from "./components/BottomActionsBar";

export default function App() {
  const [page, setPage] = useState("home");
  const [statusProps, setStatusProps] = useState({
    status: "Not started",
    confidence: 1,
    focusScore: 0,
    focusScoreLabel: "Session not started",
    sessionStart: Date.now(),
    time: new Date(),
    blinkRate: 0,
  });

  return (
    <>
      <TopStatusBar
        {...statusProps}
        page={page}
        setPage={setPage}
      />
      <div className="flex flex-col min-h-screen bg-gray-50 pt-20 pb-16">
        <main className="flex-1 w-full max-w-5xl mx-auto px-4">
          {page === "home" ? (
            <Home setStatusProps={setStatusProps} />
          ) : (
            <History />
          )}
        </main>
      </div>
      <BottomActionsBar />
    </>
  );
}
