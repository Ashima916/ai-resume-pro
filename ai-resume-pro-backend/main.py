from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models import ResumeRequest, CoverLetterRequest
from services.resume import generate_resume
from services.cover_letter import generate_cover_letter
from utils.pdf import create_pdf
from utils.docx import create_docx

app = FastAPI(title="ResumeAI API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Resume ──────────────────────────────────────────
@app.post("/generate-resume")
def resume_api(data: ResumeRequest):
    try:
        content = generate_resume(data)
        return {"content": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Cover Letter ─────────────────────────────────────
@app.post("/generate-cover-letter")
def cover_letter_api(data: CoverLetterRequest):
    try:
        content = generate_cover_letter(data)
        return {"content": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Export: fixed to accept JSON body ────────────────
class ExportRequest(BaseModel):
    content: str


@app.post("/export/pdf")
def export_pdf(req: ExportRequest):
    try:
        file_path = create_pdf(req.content)
        return FileResponse(file_path, media_type="application/pdf", filename="resume.pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/export/docx")
def export_docx(req: ExportRequest):
    try:
        file_path = create_docx(req.content)
        return FileResponse(
            file_path,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename="resume.docx"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    return {"status": "ok", "version": "2.0.0"}
