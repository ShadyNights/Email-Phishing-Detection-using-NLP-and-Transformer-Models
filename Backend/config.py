import os
from typing import List

class Settings:
    """Application settings configuration"""
    
    # API Configuration
    API_TITLE: str = "Email Phishing Detection API"
    API_DESCRIPTION: str = "BERT-based email phishing detection using Hugging Face transformers"
    API_VERSION: str = "1.0.0"
    
    # Model Configuration
    MODEL_NAME: str = "ealvaradob/bert-finetuned-phishing"
    MAX_TEXT_LENGTH: int = 512
    BATCH_SIZE: int = 16
    
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = True
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8080",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8080",
        "http://localhost:5000",
        "http://127.0.0.1:5000",
        "*"  # Allow all origins for development
    ]
    
    # Model Performance Metrics
    MODEL_ACCURACY: str = "97.17%"
    MODEL_PRECISION: str = "96.58%"
    MODEL_RECALL: str = "96.70%"
    MODEL_FPR: str = "2.49%"

# Create settings instance
settings = Settings()
