import mysql.connector
from mysql.connector import Error

DB_CONFIG = {
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': '',
    'database': 'ai_guardian'
}

def get_connection():
    """Get a MySQL connection. Returns None if connection fails."""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except Error as e:
        print(f"[DB] MySQL connection failed: {e}")
        return None

def insert_incident(emergency_type: str, description: str = None, location: str = None, source: str = 'python') -> int | None:
    """Insert an emergency incident. Returns new row ID or None."""
    conn = get_connection()
    if not conn:
        return None
    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO emergency_incidents (emergency_type, description, location, source) VALUES (%s, %s, %s, %s)",
            (emergency_type, description, location, source)
        )
        conn.commit()
        incident_id = cursor.lastrowid
        print(f"[DB] Incident saved to MySQL (id={incident_id})")
        return incident_id
    except Error as e:
        print(f"[DB] Failed to insert incident: {e}")
        return None
    finally:
        cursor.close()
        conn.close()

def insert_emergency_card(emergency_type: str, description: str = None,
                           gps_coordinates: str = None, contact_info: str = None,
                           timestamp: str = None, incident_id: int = None) -> None:
    """Insert an emergency card record."""
    conn = get_connection()
    if not conn:
        return
    try:
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO emergency_cards
               (emergency_type, description, gps_coordinates, contact_info, timestamp, source, incident_id)
               VALUES (%s, %s, %s, %s, %s, 'python', %s)""",
            (emergency_type, description, gps_coordinates, contact_info, timestamp, incident_id)
        )
        conn.commit()
        print(f"[DB] Emergency card saved to MySQL (id={cursor.lastrowid})")
    except Error as e:
        print(f"[DB] Failed to insert emergency card: {e}")
    finally:
        cursor.close()
        conn.close()
