from ai.generator import generate_text


def generate_resume(data) -> str:
    prompt = f"""
You are an expert resume writer. Generate a resume as STRICT JSON — no markdown, no explanation, only valid JSON.

JSON schema:
{{
  "name": "string",
  "role": "string",
  "email": "string",
  "phone": "string",
  "linkedin": "string",
  "summary": "2-3 sentence professional summary",
  "skills": ["skill1", "skill2", ...],
  "experience": [
    {{
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Month Year – Month Year",
      "points": ["achievement bullet 1", "achievement bullet 2", "achievement bullet 3"]
    }}
  ],
  "education": "Degree, Institution, Year"
}}

User input:
- Name: {data.name}
- Target Role: {data.role}
- Email: {data.email}
- Phone: {data.phone}
- LinkedIn: {data.linkedin}
- Experience: {data.experience}
- Skills: {data.skills}
- Education: {data.education}
- Job Description (tailor resume to this): {data.job_description or 'Not provided'}

Rules:
- Write strong, quantified bullet points wherever possible
- Tailor the summary and skills to the job description if provided
- Return ONLY the JSON object, no backticks, no prose
"""
    return generate_text(prompt)
