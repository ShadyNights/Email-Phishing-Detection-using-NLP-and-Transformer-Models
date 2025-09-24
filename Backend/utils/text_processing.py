import re
from typing import List, Dict

class TextAnalyzer:
    """Text analysis utilities"""

    def __init__(self):
        self.urgent_keywords = [
            'urgent', 'immediate', 'expire', 'suspend', 'terminate',
            'act now', 'final notice', 'time sensitive', 'verify now'
        ]
        self.suspicious_patterns = [
            'verify account', 'confirm identity', 'update payment', 'click here',
            'download attachment', 'bank account', 'credit card',
            'password', 'winner', 'lottery', 'inheritance', 'claim now'
        ]

    def extract_urls(self, text: str) -> List[str]:
        url_pattern = r'http[s]?://\S+'
        return re.findall(url_pattern, text, re.IGNORECASE)

    def count_urgent_keywords(self, text: str) -> int:
        text_lower = text.lower()
        return sum(len(re.findall(rf'\b{kw}\b', text_lower)) for kw in self.urgent_keywords)

    def count_suspicious_patterns(self, text: str) -> int:
        text_lower = text.lower()
        return sum(1 for p in self.suspicious_patterns if p in text_lower)

    def extract_email_addresses(self, text: str) -> List[str]:
        return re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b', text)

    def extract_phone_numbers(self, text: str) -> List[str]:
        return re.findall(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', text)

    def analyze_text_features(self, text: str) -> Dict:
        urls = self.extract_urls(text)
        emails = self.extract_email_addresses(text)
        phones = self.extract_phone_numbers(text)

        return {
            "text_length": len(text),
            "word_count": len(text.split()),
            "has_urls": len(urls) > 0,
            "url_count": len(urls),
            "has_emails": len(emails) > 0,
            "email_count": len(emails),
            "has_phones": len(phones) > 0,
            "phone_count": len(phones),
            "urgent_keywords_count": self.count_urgent_keywords(text),
            "suspicious_patterns_count": self.count_suspicious_patterns(text),
        }

def preprocess_email_text(subject: str, body: str) -> str:
    combined_text = f"Subject: {subject}\n\n{body}"
    return re.sub(r'\s+', ' ', combined_text).strip()
