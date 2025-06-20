import React from "react";
import TopStatusBar from "./TopStatusBar";
import BottomActionsBar from "./BottomActionsBar";

export default function DashboardLayout({ children, statusProps }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopStatusBar {...statusProps} />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">{children}</main>
      <BottomActionsBar />
    </div>
  );
} 