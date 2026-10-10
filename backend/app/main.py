from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.schemas import AnalysisResponse
from app.services.extractor import extract_text
from app.services.llm import analyze_resume

settings = get_settings()
app = FastAPI(title="Resume Analyzer API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "model": settings.llm_model}


@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze(
    resume: UploadFile = File(...),
    job_description: str = Form(..., min_length=20),
) -> AnalysisResponse:
    resume_text = await extract_text(resume)
    return analyze_resume(resume_text, job_description)