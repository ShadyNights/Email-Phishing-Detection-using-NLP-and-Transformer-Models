from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
from contextlib import asynccontextmanager

from models.request_models import EmailRequest, PredictionResponse, HealthResponse, ModelInfoResponse
from services.prediction_service import PredictionService
from config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

prediction_service = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global prediction_service
    prediction_service = PredictionService()
    await prediction_service.initialize()
    yield

app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        message="API is running",
        model_loaded=prediction_service.is_ready if prediction_service else False,
        version=settings.API_VERSION
    )

@app.post("/predict", response_model=PredictionResponse)
async def predict_phishing(request: EmailRequest):
    if not prediction_service or not prediction_service.is_ready:
        raise HTTPException(status_code=503, detail="Service not ready")
    return await prediction_service.predict_phishing(request.subject, request.body)

@app.get("/model_info", response_model=ModelInfoResponse)
async def get_model_info():
    if not prediction_service:
        raise HTTPException(status_code=503, detail="Service not ready")
    return prediction_service.get_model_info()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.RELOAD)
