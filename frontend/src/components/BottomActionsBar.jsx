import React from "react";

const actions = [
  { label: "Take Break", icon: "☕" },
  { label: "Block Distractions", icon: "🚫" },
  { label: "Start Pomodoro", icon: "⏲️" },
  { label: "Eye Exercise", icon: "👁️" },
];

export default function BottomActionsBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow flex items-center justify-center h-16 gap-6">
      {actions.map((a) => (
        <button
          key={a.label}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-700 font-semibold text-base transition"
          onClick={() => console.log(a.label)}
        >
          <span className="text-xl">{a.icon}</span> {a.label}
        </button>
      ))}
    </nav>
  );
} 