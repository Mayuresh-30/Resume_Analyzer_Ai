from functools import lru_cache

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    llm_api_key: str | None = Field(
        default=None,
        validation_alias=AliasChoices("GROQ_API_KEY", "OPENAI_API_KEY"),
    )
    llm_model: str = Field(
        default="openai/gpt-oss-20b",
        validation_alias=AliasChoices("GROQ_MODEL", "OPENAI_MODEL"),
    )
    allowed_origins: str = Field(
        default="http://localhost:5173",
        validation_alias=AliasChoices("FRONTEND_ORIGINS", "ALLOWED_ORIGINS"),
    )
    max_file_size_mb: int = 5

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()