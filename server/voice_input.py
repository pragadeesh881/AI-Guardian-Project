import speech_recognition as sr

def get_voice_input():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Please describe your emergency situation:")
        audio = recognizer.listen(source)

    try:
        text = recognizer.recognize_google(audio)
        print(f"Detected input: {text}")
        return text.lower()
    except Exception as e:
        print("Error recognizing speech:", e)
        return None
