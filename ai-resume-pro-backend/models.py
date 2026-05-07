from pydantic import BaseModel
from typing import Optional


class ResumeRequest(BaseModel):
    name: str
    role: str
    experience: str
    skills: str
    education: str
    email: Optional[str] = ""
    phone: Optional[str] = ""
    linkedin: Optional[str] = ""
    job_description: Optional[str] = ""


class CoverLetterRequest(BaseModel):
    name: str
    role: str
    experience: str
    skills: str
    job_description: Optional[str] = ""
