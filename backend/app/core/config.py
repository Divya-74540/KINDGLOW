from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "KINDGLOW API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Database Settings
    DATABASE_URL: str = "postgresql+asyncpg://postgres:D_22806@localhost:5432/kindglow_db"

    # JWT Authentication Settings
    JWT_SECRET: str = "3b5bd22eea6b77e28decc7cc2e16d41e06f953049895f4663202b173766854731a5026de4c521e26ce2a5023066ad981464d6a0282414b62f85eb091a1f47e86"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Optional AI Integrations
    OPENAI_API_KEY: str = "your_openai_api_key_here"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    AI_DEFAULT_MODEL: str = "gemma3:4b"

    # Tell Pydantic Settings to ignore extra .env fields and ignore case
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        case_sensitive=False
    )

settings = Settings()