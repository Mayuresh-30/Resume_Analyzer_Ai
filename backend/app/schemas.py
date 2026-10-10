from pydantic import BaseModel, Field


class Suggestion(BaseModel):
    category: str
    issue: str
    fix: str


class AnalysisResponse(BaseModel):
    score: int = Field(ge=0, le=100)
    summary: str
    matched_skills: list[str]
    missing_skills: list[str]
    suggestions: list[Suggestion]