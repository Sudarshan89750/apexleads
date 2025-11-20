import type { User, Chat, ChatMessage, Contact, Opportunity, PipelineStage, Appointment } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'User A' },
  { id: 'u2', name: 'User B' }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'General' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Hello', ts: Date.now() },
];
// ApexLeads Mock Data
export const MOCK_CONTACTS: Contact[] = [
  { id: 'contact-1', name: 'Alice Johnson', email: 'alice.j@example.com', phone: '123-456-7890', company: 'Innovate Inc.', status: 'Active', createdAt: '2023-05-10T10:00:00Z' },
  { id: 'contact-2', name: 'Bob Williams', email: 'bob.w@example.com', phone: '234-567-8901', company: 'Solutions Co.', status: 'Lead', createdAt: '2023-06-15T11:30:00Z' },
  { id: 'contact-3', name: 'Charlie Brown', email: 'charlie.b@example.com', phone: '345-678-9012', company: 'Tech Forward', status: 'Active', createdAt: '2023-07-20T14:00:00Z' },
  { id: 'contact-4', name: 'Diana Prince', email: 'diana.p@example.com', phone: '456-789-0123', company: 'Global Dynamics', status: 'Inactive', createdAt: '2023-08-01T09:00:00Z' },
  { id: 'contact-5', name: 'Ethan Hunt', email: 'ethan.h@example.com', phone: '567-890-1234', company: 'Synergy Corp', status: 'Lead', createdAt: '2023-09-05T16:45:00Z' },
  { id: 'contact-6', name: 'Fiona Glenanne', email: 'fiona.g@example.com', phone: '678-901-2345', company: 'NextGen Solutions', status: 'Active', createdAt: '2023-10-11T13:15:00Z' },
];
export const MOCK_PIPELINE_STAGES: PipelineStage[] = [
  { id: 'stage-1', title: 'New Lead' },
  { id: 'stage-2', title: 'Contacted' },
  { id: 'stage-3', title: 'Proposal Sent' },
  { id: 'stage-4', title: 'Negotiation' },
  { id: 'stage-5', title: 'Won' },
];
export const MOCK_OPPORTUNITIES: Opportunity[] = [
  { id: 'opp-1', title: 'Website Redesign', contactName: 'Alice Johnson', value: 5000, stageId: 'stage-3', lastUpdate: '2024-05-28T12:00:00Z', createdAt: '2024-05-20T10:00:00Z' },
  { id: 'opp-2', title: 'Marketing Campaign', contactName: 'Bob Williams', value: 2500, stageId: 'stage-1', lastUpdate: '2024-05-30T10:00:00Z', createdAt: '2024-05-29T11:30:00Z' },
  { id: 'opp-3', title: 'Cloud Migration', contactName: 'Charlie Brown', value: 12000, stageId: 'stage-4', lastUpdate: '2024-05-29T14:00:00Z', createdAt: '2024-05-22T14:00:00Z' },
  { id: 'opp-4', title: 'SEO Optimization', contactName: 'Ethan Hunt', value: 3000, stageId: 'stage-2', lastUpdate: '2024-05-27T09:00:00Z', createdAt: '2024-05-25T09:00:00Z' },
  { id: 'opp-5', title: 'E-commerce Platform', contactName: 'Fiona Glenanne', value: 8500, stageId: 'stage-5', lastUpdate: '2024-05-23T16:45:00Z', createdAt: '2024-05-15T16:45:00Z' },
  { id: 'opp-6', title: 'Mobile App Dev', contactName: 'Alice Johnson', value: 15000, stageId: 'stage-1', lastUpdate: '2024-05-30T15:00:00Z', createdAt: '2024-05-30T15:00:00Z' },
  { id: 'opp-7', title: 'CRM Implementation', contactName: 'Charlie Brown', value: 7000, stageId: 'stage-2', lastUpdate: '2024-05-26T13:15:00Z', createdAt: '2024-05-24T13:15:00Z' },
];
export const MOCK_DASHBOARD_STATS = {
  opportunities: 12,
  pipelineValue: 53000,
  conversionRate: 15.6,
  closedWonValue: 8500,
};
export const MOCK_CHART_DATA = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
];
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
export const MOCK_APPOINTMENTS: Appointment[] = [
    { id: 'appt-1', title: 'Project Kickoff with Innovate Inc.', date: today.toISOString().split('T')[0], startTime: '10:00', endTime: '11:00' },
    { id: 'appt-2', title: 'Follow-up call with Bob Williams', date: today.toISOString().split('T')[0], startTime: '14:30', endTime: '15:00' },
    { id: 'appt-3', title: 'Design Review', date: tomorrow.toISOString().split('T')[0], startTime: '11:00', endTime: '12:30' },
    { id: 'appt-4', title: 'Quarterly Business Review', date: nextWeek.toISOString().split('T')[0], startTime: '09:00', endTime: '11:00' },
];