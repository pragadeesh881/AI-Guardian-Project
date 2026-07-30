export interface EmergencyType {
  id: string;
  name: string;
  keywords: string[];
  instructions: string;
}

export interface EmergencyCard {
  emergencyType: string;
  gpsCoordinates: string;
  timestamp: string;
  description?: string;
  contactInfo?: string;
}

export interface VolunteerRequest {
  id: string;
  emergencyType: string;
  location: string;
  timestamp: string;
  status: 'active' | 'accepted' | 'resolved';
  description: string;
  distance?: number;
}

export interface FirstAidStep {
  id: number;
  instruction: string;
  isCompleted: boolean;
  isImportant: boolean;
}