import json
import tempfile
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER


def create_pdf(content: str) -> str:
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")

    # Try to parse as JSON for structured output
    try:
        clean = content.replace("```json", "").replace("```", "").strip()
        data = json.loads(clean)
        return _create_structured_pdf(temp_file.name, data)
    except Exception:
        return _create_plain_pdf(temp_file.name, content)


def _create_structured_pdf(path: str, d: dict) -> str:
    doc = SimpleDocTemplate(path, pagesize=letter,
                             leftMargin=0.75*inch, rightMargin=0.75*inch,
                             topMargin=0.75*inch, bottomMargin=0.75*inch)
    story = []
    styles = getSampleStyleSheet()

    name_style = ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=20, textColor=colors.HexColor("#1a1a2e"))
    role_style = ParagraphStyle("role", fontName="Helvetica", fontSize=11, textColor=colors.HexColor("#6366f1"))
    contact_style = ParagraphStyle("contact", fontName="Helvetica", fontSize=9, textColor=colors.grey)
    section_style = ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=9,
                                    textColor=colors.HexColor("#6366f1"), spaceAfter=4, spaceBefore=12,
                                    letterSpacing=1)
    body_style = ParagraphStyle("body", fontName="Helvetica", fontSize=10, leading=14, textColor=colors.HexColor("#333"))
    bullet_style = ParagraphStyle("bullet", fontName="Helvetica", fontSize=9, leading=13,
                                   leftIndent=12, textColor=colors.HexColor("#444"))
    job_title_style = ParagraphStyle("jobtitle", fontName="Helvetica-Bold", fontSize=10, textColor=colors.HexColor("#1a1a2e"))
    company_style = ParagraphStyle("company", fontName="Helvetica-Oblique", fontSize=9, textColor=colors.HexColor("#6366f1"))

    story.append(Paragraph(d.get("name", ""), name_style))
    story.append(Paragraph(d.get("role", ""), role_style))

    contacts = " · ".join(filter(None, [d.get("email"), d.get("phone"), d.get("linkedin")]))
    if contacts:
        story.append(Paragraph(contacts, contact_style))

    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#1a1a2e"), spaceAfter=8, spaceBefore=8))

    if d.get("summary"):
        story.append(Paragraph("PROFILE", section_style))
        story.append(Paragraph(d["summary"], body_style))

    if d.get("experience"):
        story.append(Paragraph("EXPERIENCE", section_style))
        for exp in d["experience"]:
            story.append(Paragraph(exp.get("title", ""), job_title_style))
            story.append(Paragraph(f"{exp.get('company','')} · {exp.get('duration','')}", company_style))
            for pt in exp.get("points", []):
                story.append(Paragraph(f"• {pt}", bullet_style))
            story.append(Spacer(1, 6))

    if d.get("skills"):
        story.append(Paragraph("SKILLS", section_style))
        skills_text = " · ".join(d["skills"]) if isinstance(d["skills"], list) else d["skills"]
        story.append(Paragraph(skills_text, body_style))

    if d.get("education"):
        story.append(Paragraph("EDUCATION", section_style))
        story.append(Paragraph(d["education"], body_style))

    doc.build(story)
    return path


def _create_plain_pdf(path: str, content: str) -> str:
    doc = SimpleDocTemplate(path, pagesize=letter,
                             leftMargin=0.75*inch, rightMargin=0.75*inch,
                             topMargin=0.75*inch, bottomMargin=0.75*inch)
    styles = getSampleStyleSheet()
    story = [Paragraph(line.replace("<", "&lt;"), styles["Normal"]) for line in content.split("\n")]
    doc.build(story)
    return path
