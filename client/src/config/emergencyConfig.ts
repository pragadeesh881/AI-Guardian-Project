import { EmergencyType } from '../types/emergency';

export const KEYWORDS_MAPPING: Record<string, string> = {
  'fire': 'fire',
  'earthquake': 'earthquake',
  'collapse': 'cpr',
  'unconscious': 'cpr',
  'choking': 'choking',
  'bleeding': 'bleeding',
  'drowning': 'drowning',
  'heart attack': 'heart_attack',
  'stroke': 'stroke',
  'electric shock': 'electric_shock',
  'poisoning': 'poisoning'
};

export const FIRST_AID_INSTRUCTIONS: Record<string, string> = {
  'fire': "Cover your mouth with a damp cloth and evacuate calmly. Do not use elevators.",
  'earthquake': "Drop, cover, and hold on. Stay away from windows.",
  'cpr': "Check responsiveness, call for help, begin chest compressions at 100 per minute.",
  'choking': "Perform Heimlich maneuver until the object is dislodged.",
  'bleeding': "Apply direct pressure to the wound and elevate the injured part.",
  'drowning': "Remove person from water, start CPR immediately.",
  'heart_attack': "Keep calm, help person sit, call emergency services.",
  'stroke': "Check for facial droop, speech difficulty, weakness; call emergency help.",
  'electric_shock': "Turn off power source if possible, do not touch victim directly, call emergency help.",
  'poisoning': "Do not induce vomiting. Call poison control center immediately."
};

export const EMERGENCY_TYPES: EmergencyType[] = [
  {
    id: 'fire',
    name: 'Fire Emergency',
    keywords: ['fire', 'smoke', 'burning'],
    instructions: FIRST_AID_INSTRUCTIONS.fire
  },
  {
    id: 'earthquake',
    name: 'Earthquake',
    keywords: ['earthquake', 'shaking', 'tremor'],
    instructions: FIRST_AID_INSTRUCTIONS.earthquake
  },
  {
    id: 'cpr',
    name: 'CPR Needed',
    keywords: ['collapse', 'unconscious', 'not breathing'],
    instructions: FIRST_AID_INSTRUCTIONS.cpr
  },
  {
    id: 'choking',
    name: 'Choking',
    keywords: ['choking', 'can\'t breathe', 'throat'],
    instructions: FIRST_AID_INSTRUCTIONS.choking
  },
  {
    id: 'bleeding',
    name: 'Bleeding',
    keywords: ['bleeding', 'cut', 'wound'],
    instructions: FIRST_AID_INSTRUCTIONS.bleeding
  }
];