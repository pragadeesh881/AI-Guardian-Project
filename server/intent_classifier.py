from config import KEYWORDS_MAPPING

def classify_emergency(text_input):
    for keyword, emergency_type in KEYWORDS_MAPPING.items():
        if keyword in text_input:
            return emergency_type
    return 'unknown'
