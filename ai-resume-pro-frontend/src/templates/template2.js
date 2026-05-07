import React from "react";

export default function TemplateTwo({ data }) {
  const d = data || {};
  return (
    <div className="rt2">
      {/* Header */}
      <div className="rt2-header">
        <div>
          <div className="rt2-name">{d.name || "Your Name"}</div>
          <div className="rt2-role">{d.role || d.title || ""}</div>
        </div>
        <div className="rt2-contacts">
          {d.email && <div>{d.email}</div>}
          {d.phone && <div>{d.phone}</div>}
          {d.linkedin && <div>{d.linkedin}</div>}
        </div>
      </div>

      {d.summary && (
        <div className="rt2-section">
          <div className="rt2-section-title">About</div>
          <p className="rt2-summary">{d.summary}</p>
        </div>
      )}

      {Array.isArray(d.experience) && d.experience.length > 0 && (
        <div className="rt2-section">
          <div className="rt2-section-title">Experience</div>
          {d.experience.map((exp, i) => (
            <div className="rt2-exp-item" key={i}>
              <div className="rt2-exp-meta">{exp.duration || ""}</div>
              <div>
                <div className="rt2-exp-title">{exp.title}</div>
                <div className="rt2-exp-company">{exp.company}</div>
                {Array.isArray(exp.points) && (
                  <ul className="rt2-exp-points">
                    {exp.points.map((p, j) => <li key={j}>{p}</li>)}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {Array.isArray(d.skills) && d.skills.length > 0 && (
        <div className="rt2-section">
          <div className="rt2-section-title">Skills</div>
          <div className="rt2-skills-list">
            {d.skills.map((s, i) => <span className="rt2-skill" key={i}>{s}</span>)}
          </div>
        </div>
      )}

      {d.education && (
        <div className="rt2-section">
          <div className="rt2-section-title">Education</div>
          <div className="rt2-edu">{d.education}</div>
        </div>
      )}
    </div>
  );
}
