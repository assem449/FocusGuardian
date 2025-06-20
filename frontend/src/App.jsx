import React, { useState } from "react";
import Home from "./pages/Home";
import History from "./pages/History";

export default function App() {
  const [page, setPage] = useState("home");
  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-700">🛡️ Focus Guardian</h1>
        <nav className="mt-4 flex gap-4">
          <button className={`px-4 py-2 rounded ${page === 'home' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setPage("home")}>Home</button>
          <button className={`px-4 py-2 rounded ${page === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setPage("history")}>History</button>
        </nav>
      </header>
      <main className="w-full max-w-xl">
        {page === "home" ? <Home /> : <History />}
      </main>
    </div>
  );
} 