from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "KINDGLOW Core API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Core Persistence Interconnects
    DATABASE_URL: str
    
    # Cryptographic Configuration Parameters
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # Artificial Intelligence Models Layer Endpoints
    OPENAI_API_KEY: str
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    AI_DEFAULT_MODEL: str = "gemma3:4b"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

settings = Settings()