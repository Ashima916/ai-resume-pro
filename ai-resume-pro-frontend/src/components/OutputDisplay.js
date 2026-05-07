import React, { useState, useEffect } from "react";
import { downloadPDF, downloadDOCX } from "../services/api";
import ResumeRenderer from "./ResumeRenderer";
import { computeATS } from "../utils/ats";

const TABS = ["Resume", "Cover Letter", "ATS Score"];

export default function OutputDisplay({ result, onBack }) {
  const [activeTab, setActiveTab] = useState(0);
  const [ats, setAts] = useState(null);
  const [downloading, setDownloading] = useState(null);

  // Parse resume JSON
  let parsedResume = null;
  try {
    const clean = (result?.resume || "").replace(/```json/g, "").replace(/```/g, "").trim();
    parsedResume = JSON.parse(clean);
  } catch (_) {}

  useEffect(() => {
    if (parsedResume && result?.jobDescription) {
      setAts(computeATS(parsedResume, result.jobDescription));
    }
  }, [result]);

  const handleDownload = async (type) => {
    setDownloading(type);
    try {
      const response = type === "pdf"
        ? await downloadPDF(result.resume)
        : await downloadDOCX(result.resume);

      const mimeType = type === "pdf"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

      const blob = new Blob([response.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `resume.${type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert(`Download failed: ${err.message}. Check backend is running at http://127.0.0.1:8000`);
    } finally {
      setDownloading(null);
    }
  };

  if (!result) return null;

  const atsClass = ats
    ? ats.score >= 70 ? "high" : ats.score >= 45 ? "mid" : "low"
    : "mid";

  return (
    <div className="output-page">
      <div className="output-header">
        <div>
          <h1 className="output-title">Your Resume is Ready ✦</h1>
          {ats && (
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>
              ATS Match Score: <span style={{ color: ats.score >= 70 ? "var(--accent3)" : ats.score >= 45 ? "#fbbf24" : "#f87171", fontWeight: 600 }}>{ats.score}%</span>
            </div>
          )}
        </div>
        <div className="output-actions">
          <button
            className="btn-download docx"
            onClick={() => handleDownload("docx")}
            disabled={!!downloading}
          >
            {downloading === "docx" ? "⋯" : "↓"} DOCX
          </button>
          <button
            className="btn-download pdf"
            onClick={() => handleDownload("pdf")}
            disabled={!!downloading}
          >
            {downloading === "pdf" ? "⋯" : "↓"} PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="output-tabs">
        {TABS.map((t, i) => (
          <button
            key={t}
            className={`tab-btn ${activeTab === i ? "active" : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {t}
            {i === 2 && ats && (
              <span style={{ marginLeft: 6, fontSize: "0.75rem", opacity: 0.7 }}>
                {ats.score}%
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 0: Resume Preview */}
      {activeTab === 0 && (
        <div className="resume-preview-wrap">
          <ResumeRenderer data={parsedResume} template={result.template} />
        </div>
      )}

      {/* Tab 1: Cover Letter */}
      {activeTab === 1 && (
        <div className="cover-letter-card">
          <div className="section-heading" style={{ marginBottom: "1.5rem" }}>Cover Letter</div>
          {result.coverLetter ? (
            <div className="cover-letter-text">{result.coverLetter}</div>
          ) : (
            <div style={{ color: "var(--text-muted)" }}>No cover letter generated.</div>
          )}
        </div>
      )}

      {/* Tab 2: ATS Score */}
      {activeTab === 2 && ats && (
        <div className="ats-score-card">
          <div className="ats-score-header">
            <div>
              <div className="ats-score-title">ATS Compatibility Score</div>
              <div style={{ fontSize: "0.83rem", color: "var(--text-muted)", marginTop: 4 }}>
                Based on keyword match with the job description
              </div>
            </div>
            <div className={`ats-score-num ${atsClass}`}>{ats.score}%</div>
          </div>
          <div className="ats-bar">
            <div className="ats-fill" style={{ width: `${ats.score}%` }} />
          </div>

          {ats.matched.length > 0 && (
            <div style={{ marginTop: "1.5rem" }}>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                ✓ Matched Keywords
              </div>
              <div className="ats-keywords">
                {ats.matched.map(k => <span key={k} className="kw-chip match">{k}</span>)}
              </div>
            </div>
          )}

          {ats.missing.length > 0 && (
            <div style={{ marginTop: "1.25rem" }}>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                ✗ Consider Adding
              </div>
              <div className="ats-keywords">
                {ats.missing.map(k => <span key={k} className="kw-chip miss">{k}</span>)}
              </div>
            </div>
          )}

          {!result.jobDescription && (
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "1rem" }}>
              Add a job description in the form to see ATS scoring.
            </div>
          )}
        </div>
      )}

      {activeTab === 2 && !ats && (
        <div className="ats-score-card" style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>◎</div>
          <div style={{ color: "var(--text-muted)" }}>
            Paste a job description in Step 3 to get your ATS match score.
          </div>
        </div>
      )}
    </div>
  );
}
