export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Minimal real-world chat example types (shared by frontend and worker)
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}
// ApexLeads specific types
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'Lead' | 'Active' | 'Inactive';
  createdAt: string;
}
export interface Opportunity {
  id: string;
  title: string;
  contactName: string;
  value: number;
  stageId: string;
  lastUpdate: string;
  createdAt: string;
}
export interface PipelineStage {
  id: string;
  title: string;
}
export interface Appointment {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    startTime: string; // HH:MM
    endTime: string; // HH:MM
}
export interface ActivityLog {
  id: string;
  type: 'contact' | 'opportunity' | 'appointment';
  description: string;
  timestamp: string;
  link?: string;
}