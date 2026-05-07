import React, { useState } from "react";
import { generateResume, generateCoverLetter } from "../services/api";

const STEPS = ["Personal", "Experience", "Job Target", "Template"];

const TEMPLATE_OPTIONS = [
  {
    id: "template1",
    name: "Clean Modern",
    desc: "Dark header, two-column layout",
    preview: (
      <svg viewBox="0 0 180 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="180" height="100" fill="#f4f5fb"/>
        <rect width="180" height="32" fill="#1a1a2e"/>
        <rect x="12" y="9" width="80" height="8" rx="2" fill="rgba(255,255,255,0.8)"/>
        <rect x="12" y="20" width="48" height="5" rx="2" fill="rgba(255,255,255,0.3)"/>
        <rect x="12" y="38" width="100" height="4" rx="2" fill="#ddd"/>
        <rect x="12" y="46" width="72" height="3" rx="2" fill="#eee"/>
        <rect x="12" y="52" width="88" height="3" rx="2" fill="#eee"/>
        <rect x="130" y="38" width="38" height="4" rx="2" fill="#ddd"/>
        <rect x="130" y="46" width="30" height="3" rx="2" fill="#ede9fe"/>
        <rect x="130" y="52" width="34" height="3" rx="2" fill="#ede9fe"/>
        <rect x="130" y="58" width="28" height="3" rx="2" fill="#ede9fe"/>
      </svg>
    ),
  },
  {
    id: "template2",
    name: "Minimal Elegant",
    desc: "Single-column, editorial style",
    preview: (
      <svg viewBox="0 0 180 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="180" height="100" fill="#fff"/>
        <rect x="16" y="14" width="90" height="10" rx="2" fill="#111"/>
        <rect x="16" y="27" width="55" height="5" rx="2" fill="#888"/>
        <rect x="16" y="34" width="148" height="1" fill="#111"/>
        <rect x="16" y="42" width="60" height="3" rx="2" fill="#ddd"/>
        <rect x="16" y="48" width="148" height="2" rx="1" fill="#f0f0f0"/>
        <rect x="16" y="53" width="120" height="2" rx="1" fill="#f0f0f0"/>
        <rect x="16" y="62" width="60" height="3" rx="2" fill="#ddd"/>
        <rect x="16" y="68" width="148" height="2" rx="1" fill="#f0f0f0"/>
        <rect x="16" y="73" width="100" height="2" rx="1" fill="#f0f0f0"/>
        <rect x="16" y="82" width="60" height="3" rx="2" fill="#ddd"/>
      </svg>
    ),
  },
];

export default function ResumeForm({ setResult }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("template1");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    role: "",
    experience: "",
    skills: "",
    education: "",
    job_description: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const [resumeRes, coverRes] = await Promise.all([
        generateResume(form),
        generateCoverLetter(form),
      ]);
      setResult({
        resume: resumeRes.data.content,
        coverLetter: coverRes.data.content,
        jobDescription: form.job_description,
        template: selectedTemplate,
      });
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Error generating content. Is the backend running?";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-header">
        <h1 className="form-title">Build Your Resume</h1>
        <p className="form-subtitle">Fill in your details — the AI handles the writing.</p>
      </div>

      {/* Steps bar */}
      <div className="steps-bar">
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <div
              className={`step-item ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
              onClick={() => i < step && setStep(i)}
            >
              <div className="step-num">{i < step ? "✓" : i + 1}</div>
              <div className="step-label">{label}</div>
            </div>
            {i < STEPS.length - 1 && <div className="step-divider" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 0: Personal */}
      {step === 0 && (
        <div className="form-section">
          <div className="section-heading">Personal Info</div>
          <div className="fields-grid">
            <div className="field-group">
              <label className="field-label">Full Name *</label>
              <input className="field-input" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Arjun Sharma" />
            </div>
            <div className="field-group">
              <label className="field-label">Target Role *</label>
              <input className="field-input" name="role" value={form.role} onChange={handleChange} placeholder="e.g. Senior Frontend Engineer" />
            </div>
            <div className="field-group">
              <label className="field-label">Email</label>
              <input className="field-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>
            <div className="field-group">
              <label className="field-label">Phone</label>
              <input className="field-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
            </div>
            <div className="field-group field-full">
              <label className="field-label">LinkedIn URL</label>
              <input className="field-input" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="linkedin.com/in/yourname" />
            </div>
            <div className="field-group field-full">
              <label className="field-label">Education</label>
              <input className="field-input" name="education" value={form.education} onChange={handleChange} placeholder="B.Tech CSE — Delhi University, 2022" />
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Experience */}
      {step === 1 && (
        <div className="form-section">
          <div className="section-heading">Experience & Skills</div>
          <div className="fields-grid single">
            <div className="field-group">
              <label className="field-label">Work Experience *</label>
              <textarea
                className="field-textarea"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                style={{ minHeight: 140 }}
                placeholder={`Describe your work experience:\n• 2 years at Infosys as React Developer — built dashboards for 50k+ users\n• 1 year internship at startup — led migration from Angular to React`}
              />
            </div>
            <div className="field-group">
              <label className="field-label">Skills *</label>
              <textarea
                className="field-textarea"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="React, Node.js, TypeScript, AWS, Docker, PostgreSQL, Git, Figma..."
              />
              <div className="ats-hint">
                <div className="ats-dot" />
                Tip: Include both technical skills and tools — they boost your ATS score
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Job Target */}
      {step === 2 && (
        <div className="form-section">
          <div className="section-heading">Target Job Description</div>
          <div className="fields-grid single">
            <div className="field-group">
              <label className="field-label">Job Description (paste here)</label>
              <textarea
                className="field-textarea"
                name="job_description"
                value={form.job_description}
                onChange={handleChange}
                style={{ minHeight: 200 }}
                placeholder="Paste the job description here. The AI will tailor your resume and calculate an ATS match score.&#10;&#10;Example: 'We are looking for a Senior React Developer with 3+ years of experience in TypeScript, REST APIs...'"
              />
              <div className="ats-hint">
                <div className="ats-dot" />
                Pasting a job description enables ATS scoring and resume tailoring
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Template */}
      {step === 3 && (
        <div className="form-section">
          <div className="section-heading">Choose Template</div>
          <div className="template-grid">
            {TEMPLATE_OPTIONS.map((t) => (
              <div
                key={t.id}
                className={`template-card ${selectedTemplate === t.id ? "selected" : ""}`}
                onClick={() => setSelectedTemplate(t.id)}
              >
                <div className="template-preview">{t.preview}</div>
                <div className="template-name">{t.name}</div>
                <div className="template-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="form-nav">
        {step > 0 ? (
          <button className="btn-back" onClick={prev}>← Back</button>
        ) : <div />}

        {step < STEPS.length - 1 ? (
          <button
            className="btn-generate"
            onClick={next}
            disabled={step === 0 && (!form.name || !form.role)}
          >
            Next →
          </button>
        ) : (
          <button
            className="btn-generate"
            onClick={handleGenerate}
            disabled={loading || !form.name || !form.role}
          >
            {loading ? (
              <><div className="spinner" /> Generating…</>
            ) : (
              "✦ Generate Resume"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
