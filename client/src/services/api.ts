// API service layer — connects React frontend to MySQL via Express API
const API_BASE = 'http://localhost:3001/api';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Incident {
  id: number;
  emergency_type: string;
  description: string | null;
  gps_coordinates: string | null;
  location: string | null;
  status: 'active' | 'resolved';
  source: 'web' | 'python';
  created_at: string;
  updated_at: string;
}

export interface VolunteerRequest {
  id: number;
  emergency_type: string;
  location: string;
  description: string | null;
  status: 'active' | 'accepted' | 'resolved';
  distance: number | null;
  incident_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface EmergencyCardRecord {
  id: number;
  emergency_type: string;
  gps_coordinates: string | null;
  description: string | null;
  contact_info: string | null;
  timestamp: string;
  source: 'web' | 'python';
  incident_id: number | null;
  created_at: string;
}

// ─── Helper ───────────────────────────────────────────────────────────────────
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ─── Incidents ────────────────────────────────────────────────────────────────
export const getIncidents = () => request<Incident[]>('/incidents');

export const createIncident = (data: {
  emergency_type: string;
  description?: string;
  gps_coordinates?: string;
  location?: string;
  source?: 'web' | 'python';
}) => request<Incident>('/incidents', { method: 'POST', body: JSON.stringify(data) });

export const updateIncidentStatus = (id: number, status: 'active' | 'resolved') =>
  request<Incident>(`/incidents/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });

// ─── Volunteer Requests ───────────────────────────────────────────────────────
export const getVolunteerRequests = () => request<VolunteerRequest[]>('/volunteers');

export const updateVolunteerStatus = (id: number, status: 'active' | 'accepted' | 'resolved') =>
  request<VolunteerRequest>(`/volunteers/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });

// ─── Emergency Cards ──────────────────────────────────────────────────────────
export const saveEmergencyCard = (data: {
  emergency_type: string;
  gps_coordinates?: string;
  description?: string;
  contact_info?: string;
  timestamp?: string;
  source?: 'web' | 'python';
  incident_id?: number;
}) => request<EmergencyCardRecord>('/emergency-cards', { method: 'POST', body: JSON.stringify(data) });

export const getEmergencyCards = () => request<EmergencyCardRecord[]>('/emergency-cards');

// ─── Health Check ─────────────────────────────────────────────────────────────
export const checkApiHealth = () =>
  request<{ status: string; database: string; timestamp: string }>('/health');
