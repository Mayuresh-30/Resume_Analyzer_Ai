import json
import logging
import re

from fastapi import HTTPException
from groq import Groq
from pydantic import ValidationError

from app.config import get_settings
from app.prompts import SYSTEM_PROMPT, build_user_prompt
from app.schemas import AnalysisResponse

logger = logging.getLogger(__name__)

client = Groq(api_key=get_settings().llm_api_key)

Model = get_settings().llm_model
def analyze_resume(resume_text: str, job_description: str | None) -> AnalysisResponse:
    settings = get_settings()
    if not settings.llm_api_key:
        raise HTTPException(status_code=503, detail="Set LLM_API_KEY in backend/.env to enable analysis.")

    try:
        response = client.chat.completions.create(
            model=Model,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": build_user_prompt(resume_text[:15000], job_description)},
            ],
            temperature=0.2,
        )

    except Exception as exc:
        logger.exception("Groq chat completion request failed")
        raise HTTPException(status_code=502, detail="The analysis service could not complete the request.") from exc

    content = response.choices[0].message.content
    if not content:
        raise HTTPException(status_code=502, detail="The analysis service returned an empty response.")

    try:
        payload = json.loads(content)
    except json.JSONDecodeError:
        cleaned_content = re.sub(r"^\s*```(?:json)?\s*|\s*```\s*$", "", content, flags=re.IGNORECASE)
        try:
            payload = json.loads(cleaned_content)
        except json.JSONDecodeError as exc:
            raise HTTPException(status_code=502, detail="The analysis service returned invalid JSON.") from exc

    try:
        return AnalysisResponse.model_validate(payload)
    except (ValidationError, ValueError) as exc:
        raise HTTPException(status_code=502, detail="The analysis service returned an invalid response.") from exc