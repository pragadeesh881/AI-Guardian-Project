from voice_input import get_voice_input
from intent_classifier import classify_emergency
from first_aid_engine import get_first_aid_instructions
from tts_output import speak_text
from emergency_card import generate_emergency_card
from db import insert_incident
# from playsound import playsound
from playsound3 import playsound 

def play_beep():
    playsound('data/beep.mp3')  # Play beep before listening

def main():
    speak_text("Please describe your emergency situation after the beep.")
    play_beep()

    voice_input = get_voice_input()

    if not voice_input:
        speak_text("Sorry, I could not hear you. Please try again later.")
        return

    emergency_type = classify_emergency(voice_input)
    print(f"[DEBUG] Emergency Type Detected: {emergency_type}")

    instructions = get_first_aid_instructions(emergency_type)
    print(f"[DEBUG] First Aid Instructions: {instructions}")

    # Save incident to MySQL
    incident_id = insert_incident(
        emergency_type=emergency_type,
        description=voice_input,
        location="Voice Input (Python Server)",
        source="python"
    )

    speak_text(f"Emergency detected as {emergency_type}.")
    speak_text(instructions)

    # Generate emergency card and save to MySQL (pass incident_id to link records)
    generate_emergency_card(emergency_type, incident_id=incident_id)
    speak_text("An emergency card has been generated and saved.")

if __name__ == "__main__":
    main()
