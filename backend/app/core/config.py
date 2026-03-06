from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "HRMS Lite"
    DATABASE_URL: str = "sqlite:///./hrms.db"  # Default for local testing if MySQL not configured yet

    class Config:
        env_file = ".env"

settings = Settings()
