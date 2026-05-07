import React from "react";
import TemplateOne from "../templates/template1";
import TemplateTwo from "../templates/template2";

export default function ResumeRenderer({ data, template }) {
  if (!data) {
    return (
      <div style={{ padding: "2rem", color: "#888", textAlign: "center" }}>
        Could not parse resume data.
      </div>
    );
  }

  if (template === "template2") return <TemplateTwo data={data} />;
  return <TemplateOne data={data} />;
}
