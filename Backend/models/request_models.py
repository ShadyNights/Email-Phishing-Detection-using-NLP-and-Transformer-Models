from pydantic import BaseModel, Field, validator
from typing import Dict, Any, List

class EmailRequest(BaseModel):
    """Request model for email phishing detection"""
    subject: str = Field(..., min_length=1, max_length=200, description="Email subject line")
    body: str = Field(..., min_length=10, max_length=10000, description="Email body content")
    
    @validator('subject')
    def validate_subject(cls, v):
        if not v.strip():
            raise ValueError('Subject cannot be empty or whitespace only')
        return v.strip()
    
    @validator('body')
    def validate_body(cls, v):
        if not v.strip():
            raise ValueError('Email body cannot be empty or whitespace only')
        if len(v.strip()) < 10:
            raise ValueError('Email body must be at least 10 characters long')
        return v.strip()
    
    class Config:
        schema_extra = {
            "example": {
                "subject": "Urgent: Account Verification Required",
                "body": "Dear Customer, Your account has been flagged for suspicious activity. Please verify immediately by clicking the link below..."
            }
        }

class PredictionResponse(BaseModel):
    """Response model for phishing prediction results"""
    is_phishing: bool
    confidence: float
    prediction_class: str
    model_info: Dict[str, str]
    analysis_details: Dict[str, Any]

class HealthResponse(BaseModel):
    """Response model for health check endpoint"""
    status: str
    message: str
    model_loaded: bool
    version: str

class ModelInfoResponse(BaseModel):
    """Response model for model information endpoint"""
    model_name: str
    model_type: str
    accuracy: str
    precision: str
    recall: str
    false_positive_rate: str
    description: str
    supported_languages: List[str]
    max_text_length: int
