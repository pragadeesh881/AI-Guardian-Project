import time
import random
from db import insert_emergency_card

def generate_emergency_card(emergency_type, incident_id=None):
    gps_coordinates = f"{random.uniform(-90, 90):.6f}, {random.uniform(-180, 180):.6f}"
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    contact_info = "Emergency Contact: +1-555-0123"

    card_content = f"""
    Emergency Type: {emergency_type}
    GPS Coordinates: {gps_coordinates}
    Timestamp: {timestamp}
    Contact: {contact_info}
    """

    # Save to text file (legacy fallback)
    with open('emergency_card.txt', 'w') as file:
        file.write(card_content)
    print("[INFO] Emergency card written to emergency_card.txt")

    # Save to MySQL database
    insert_emergency_card(
        emergency_type=emergency_type,
        gps_coordinates=gps_coordinates,
        contact_info=contact_info,
        timestamp=timestamp,
        incident_id=incident_id
    )
