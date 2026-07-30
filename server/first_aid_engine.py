from config import FIRST_AID_INSTRUCTIONS

def get_first_aid_instructions(emergency_type):
    return FIRST_AID_INSTRUCTIONS.get(emergency_type, "Emergency type unknown. Call emergency services.")
