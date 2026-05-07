from ai.generator import generate_text


def generate_cover_letter(data) -> str:
    prompt = f"""
Write a concise, compelling cover letter for a job application.

Applicant details:
- Name: {data.name}
- Applying for: {data.role}
- Experience: {data.experience}
- Skills: {data.skills}
- Job Description: {data.job_description or 'Not provided'}

Guidelines:
- 3 paragraphs: opening hook, key achievements/fit, confident close
- Personalize to the job description if provided
- Professional but not stiff — show personality
- Do not include date/address headers, just the body text
- Max 250 words
"""
    return generate_text(prompt)
