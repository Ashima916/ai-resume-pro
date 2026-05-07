import React, { useState } from "react";
import ResumeForm from "./components/ResumeForm";
import OutputDisplay from "./components/OutputDisplay";
import LandingHero from "./components/LandingHero";
import "./App.css";

function App() {
  const [result, setResult] = useState(null);
  const [view, setView] = useState("landing"); // landing | form | output

  const handleStart = () => setView("form");
  const handleResult = (data) => {
    setResult(data);
    setView("output");
  };
  const handleBack = () => {
    setResult(null);
    setView("form");
  };
  const handleHome = () => {
    setResult(null);
    setView("landing");
  };

  return (
    <div className="app-root">
      <nav className="topnav">
        <div className="topnav-logo" onClick={handleHome}>
          <span className="logo-icon">◈</span>
          <span className="logo-text">ResumeAI</span>
        </div>
        <div className="topnav-links">
          {view !== "landing" && (
            <button className="nav-btn" onClick={handleHome}>Home</button>
          )}
          {view === "output" && (
            <button className="nav-btn" onClick={handleBack}>Edit</button>
          )}
        </div>
      </nav>

      <main className="app-main">
        {view === "landing" && <LandingHero onStart={handleStart} />}
        {view === "form" && <ResumeForm setResult={handleResult} />}
        {view === "output" && <OutputDisplay result={result} onBack={handleBack} />}
      </main>
    </div>
  );
}

export default App;
