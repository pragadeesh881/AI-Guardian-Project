import { KEYWORDS_MAPPING, FIRST_AID_INSTRUCTIONS } from '../config/emergencyConfig';
import { EmergencyCard, FirstAidStep } from '../types/emergency';

export const classifyEmergency = (textInput: string): string => {
  const lowerInput = textInput.toLowerCase();
  for (const [keyword, emergencyType] of Object.entries(KEYWORDS_MAPPING)) {
    if (lowerInput.includes(keyword)) {
      return emergencyType;
    }
  }
  return 'unknown';
};

export const getFirstAidInstructions = (emergencyType: string): string => {
  return FIRST_AID_INSTRUCTIONS[emergencyType] || "Emergency type unknown. Call emergency services.";
};

export const generateEmergencyCard = (emergencyType: string, description?: string): EmergencyCard => {
  // Simulate GPS coordinates (in real app, would use navigator.geolocation)
  const gpsCoordinates = `${(Math.random() * 180 - 90).toFixed(6)}, ${(Math.random() * 360 - 180).toFixed(6)}`;
  const timestamp = new Date().toLocaleString();

  return {
    emergencyType,
    gpsCoordinates,
    timestamp,
    description,
    contactInfo: 'Emergency Contact: +1-555-0123'
  };
};

export const parseInstructionsToSteps = (instructions: string): FirstAidStep[] => {
  const sentences = instructions.split(/[.!]/).filter(s => s.trim().length > 0);
  return sentences.map((instruction, index) => ({
    id: index + 1,
    instruction: instruction.trim(),
    isCompleted: false,
    isImportant: instruction.toLowerCase().includes('call') || instruction.toLowerCase().includes('emergency')
  }));
};

export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  });
};