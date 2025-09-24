import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import logging
from typing import Dict
import numpy as np
from config import settings

logger = logging.getLogger(__name__)

class BERTPhishingDetector:
    """BERT-based phishing email detector"""

    def __init__(self, model_name: str = settings.MODEL_NAME):
        self.model_name = model_name
        self.tokenizer = None
        self.model = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.is_loaded = False

    async def load_model(self) -> None:
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.model_name, trust_remote_code=True, use_fast=True
            )
            self.model = AutoModelForSequenceClassification.from_pretrained(
                self.model_name,
                trust_remote_code=True,
                torch_dtype=torch.float32 if self.device.type == "cpu" else torch.float16
            )
            self.model.to(self.device)
            self.model.eval()
            self.is_loaded = True
        except Exception as e:
            self.is_loaded = False
            raise RuntimeError(f"Model loading failed: {str(e)}")

    async def predict(self, email_text: str) -> Dict:
        if not self.is_loaded:
            raise RuntimeError("Model not loaded. Call load_model() first.")
        
        inputs = self.tokenizer(
            email_text, return_tensors="pt", truncation=True,
            padding=True, max_length=settings.MAX_TEXT_LENGTH
        )
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
            predicted_class_id = torch.argmax(probabilities, dim=-1).item()
            confidence = torch.max(probabilities, dim=-1)[0].item()
            class_probabilities = probabilities.cpu().numpy().flatten()
        
        is_phishing = bool(predicted_class_id)
        prediction_class = "PHISHING" if is_phishing else "LEGITIMATE"
        
        return {
            "is_phishing": is_phishing,
            "confidence": float(confidence),
            "prediction_class": prediction_class,
            "class_probabilities": {
                "legitimate": float(class_probabilities[0]),
                "phishing": float(class_probabilities[1])
            },
            "model_name": self.model_name
        }

    def get_model_info(self) -> Dict:
        return {
            "model_name": self.model_name,
            "model_type": "BERT Fine-tuned for Phishing Detection",
            "accuracy": settings.MODEL_ACCURACY,
            "precision": settings.MODEL_PRECISION,
            "recall": settings.MODEL_RECALL,
            "false_positive_rate": settings.MODEL_FPR,
            "description": "BERT model fine-tuned on phishing email dataset",
            "supported_languages": ["English"],
            "max_text_length": settings.MAX_TEXT_LENGTH,
            "device": str(self.device),
            "is_loaded": self.is_loaded
        }
