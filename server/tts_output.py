import pyttsx3

# Initialize engine only once, globally
engine = pyttsx3.init()
engine.setProperty('rate', 150)  # Adjust speed for clarity

def speak_text(text):
    print(f"[VOICE OUTPUT] {text}")  # For debug purposes
    engine.say(text)
    engine.runAndWait()  # Block until speech is finished
