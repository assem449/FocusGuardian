import React from "react";

export default function QuickActionsBar({ onAction }) {
  const actions = [
    { 
      id: "take-break", 
      label: "Take Break", 
      icon: "☕", 
      description: "5-minute break",
      color: "bg-blue-100 hover:bg-blue-200 text-blue-700"
    },
    { 
      id: "block-distractions", 
      label: "Block Distractions", 
      icon: "🚫", 
      description: "Focus mode",
      color: "bg-red-100 hover:bg-red-200 text-red-700"
    },
    { 
      id: "start-pomodoro", 
      label: "Start Pomodoro", 
      icon: "⏲️", 
      description: "25min work",
      color: "bg-green-100 hover:bg-green-200 text-green-700"
    },
    { 
      id: "eye-exercise", 
      label: "Eye Exercise", 
      icon: "👁️", 
      description: "20-20-20 rule",
      color: "bg-purple-100 hover:bg-purple-200 text-purple-700"
    },
    { 
      id: "posture-check", 
      label: "Posture Check", 
      icon: "🧍", 
      description: "Sit up straight",
      color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
    },
  ];

  const handleAction = (actionId) => {
    if (onAction) {
      onAction(actionId);
    }
    console.log(`Action triggered: ${actionId}`);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center h-16 gap-3">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${action.color} hover:scale-105 active:scale-95`}
              title={action.description}
            >
              <span className="text-lg">{action.icon}</span>
              <span className="text-xs">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
} 