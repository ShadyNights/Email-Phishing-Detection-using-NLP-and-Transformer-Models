import logging
from typing import Dict, Any
from models.bert_detector import BERTPhishingDetector
from utils.text_processing import TextAnalyzer, preprocess_email_text
from config import settings

logger = logging.getLogger(__name__)

class PredictionService:
    """Service for email phishing predictions"""

    def __init__(self):
        self.bert_detector = BERTPhishingDetector()
        self.text_analyzer = TextAnalyzer()
        self.is_initialized = False

    async def initialize(self) -> None:
        await self.bert_detector.load_model()
        self.is_initialized = True

    async def predict_phishing(self, subject: str, body: str) -> Dict[str, Any]:
        if not self.is_initialized:
            raise RuntimeError("Prediction service not initialized")

        email_text = preprocess_email_text(subject, body)
        bert_prediction = await self.bert_detector.predict(email_text)
        text_features = self.text_analyzer.analyze_text_features(email_text)

        return {
            "is_phishing": bert_prediction["is_phishing"],
            "confidence": bert_prediction["confidence"],
            "prediction_class": bert_prediction["prediction_class"],
            "model_info": {
                "model_name": bert_prediction["model_name"],
                "accuracy": settings.MODEL_ACCURACY,
                "precision": settings.MODEL_PRECISION,
                "recall": settings.MODEL_RECALL
            },
            "analysis_details": {**text_features, "class_probabilities": bert_prediction["class_probabilities"]}
        }

    def get_model_info(self) -> Dict:
        return self.bert_detector.get_model_info()

    @property
    def is_ready(self) -> bool:
        return self.is_initialized and self.bert_detector.is_loaded
