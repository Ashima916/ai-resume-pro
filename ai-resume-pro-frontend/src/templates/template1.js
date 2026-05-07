import React from "react";

export default function TemplateOne({ data }) {
  const d = data || {};
  return (
    <div className="rt1">
      {/* Header */}
      <div className="rt1-header">
        <div className="rt1-name">{d.name || "Your Name"}</div>
        <div className="rt1-role">{d.role || d.title || ""}</div>
        <div className="rt1-contacts">
          {d.email && <span>✉ {d.email}</span>}
          {d.phone && <span>✆ {d.phone}</span>}
          {d.linkedin && <span>in {d.linkedin}</span>}
        </div>
      </div>

      {/* Body */}
      <div className="rt1-body">
        {/* Main column */}
        <div className="rt1-main">
          {d.summary && (
            <div style={{ marginBottom: 24 }}>
              <div className="rt1-section-title">Profile</div>
              <p className="rt1-summary">{d.summary}</p>
            </div>
          )}

          {Array.isArray(d.experience) && d.experience.length > 0 && (
            <div>
              <div className="rt1-section-title">Experience</div>
              {d.experience.map((exp, i) => (
                <div className="rt1-exp-item" key={i}>
                  <div className="rt1-exp-title">{exp.title}</div>
                  <div className="rt1-exp-company">
                    {exp.company}{exp.duration ? ` · ${exp.duration}` : ""}
                  </div>
                  {Array.isArray(exp.points) && (
                    <ul className="rt1-exp-points">
                      {exp.points.map((p, j) => <li key={j}>{p}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="rt1-sidebar">
          {Array.isArray(d.skills) && d.skills.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div className="rt1-section-title">Skills</div>
              <div>
                {d.skills.map((s, i) => (
                  <span className="rt1-skill-chip" key={i}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {d.education && (
            <div>
              <div className="rt1-section-title">Education</div>
              <div className="rt1-edu">{d.education}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
