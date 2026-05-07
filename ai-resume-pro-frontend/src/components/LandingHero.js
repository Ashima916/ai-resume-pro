import React from "react";

const features = [
  { icon: "✦", title: "AI Resume Writer", desc: "Crafts tailored, keyword-rich resumes from your experience" },
  { icon: "◎", title: "ATS Score Checker", desc: "See how well your resume matches any job description" },
  { icon: "✉", title: "Cover Letter Gen", desc: "One-click professional cover letters tailored to the role" },
  { icon: "⬡", title: "2 Premium Templates", desc: "Clean Modern & Minimal Elegant — ready to download" },
];

export default function LandingHero({ onStart }) {
  return (
    <>
      <div className="bg-mesh" />
      <section className="landing">
        <div className="landing-badge">AI-POWERED RESUME BUILDER</div>
        <h1 className="landing-title">
          Land your next job with an{" "}
          <span className="gradient-word">AI-crafted</span> resume
        </h1>
        <div className="landing-cta">
          <button className="btn-primary" onClick={onStart}>
            Build My Resume →
          </button>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
