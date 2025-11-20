import type { User, Chat, ChatMessage, Contact, Opportunity, PipelineStage } from './types';
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
  { id: 'contact-1', name: 'Alice Johnson', email: 'alice.j@example.com', phone: '123-456-7890', company: 'Innovate Inc.', status: 'Active', createdAt: '2023-05-10' },
  { id: 'contact-2', name: 'Bob Williams', email: 'bob.w@example.com', phone: '234-567-8901', company: 'Solutions Co.', status: 'Lead', createdAt: '2023-06-15' },
  { id: 'contact-3', name: 'Charlie Brown', email: 'charlie.b@example.com', phone: '345-678-9012', company: 'Tech Forward', status: 'Active', createdAt: '2023-07-20' },
  { id: 'contact-4', name: 'Diana Prince', email: 'diana.p@example.com', phone: '456-789-0123', company: 'Global Dynamics', status: 'Inactive', createdAt: '2023-08-01' },
  { id: 'contact-5', name: 'Ethan Hunt', email: 'ethan.h@example.com', phone: '567-890-1234', company: 'Synergy Corp', status: 'Lead', createdAt: '2023-09-05' },
  { id: 'contact-6', name: 'Fiona Glenanne', email: 'fiona.g@example.com', phone: '678-901-2345', company: 'NextGen Solutions', status: 'Active', createdAt: '2023-10-11' },
];
export const MOCK_PIPELINE_STAGES: PipelineStage[] = [
  { id: 'stage-1', title: 'New Lead' },
  { id: 'stage-2', title: 'Contacted' },
  { id: 'stage-3', title: 'Proposal Sent' },
  { id: 'stage-4', title: 'Negotiation' },
  { id: 'stage-5', title: 'Won' },
];
export const MOCK_OPPORTUNITIES: Opportunity[] = [
  { id: 'opp-1', title: 'Website Redesign', contactName: 'Alice Johnson', value: 5000, stageId: 'stage-3', lastUpdate: '2 days ago' },
  { id: 'opp-2', title: 'Marketing Campaign', contactName: 'Bob Williams', value: 2500, stageId: 'stage-1', lastUpdate: '5 hours ago' },
  { id: 'opp-3', title: 'Cloud Migration', contactName: 'Charlie Brown', value: 12000, stageId: 'stage-4', lastUpdate: '1 day ago' },
  { id: 'opp-4', title: 'SEO Optimization', contactName: 'Ethan Hunt', value: 3000, stageId: 'stage-2', lastUpdate: '3 days ago' },
  { id: 'opp-5', title: 'E-commerce Platform', contactName: 'Fiona Glenanne', value: 8500, stageId: 'stage-5', lastUpdate: '1 week ago' },
  { id: 'opp-6', title: 'Mobile App Dev', contactName: 'Alice Johnson', value: 15000, stageId: 'stage-1', lastUpdate: 'Just now' },
  { id: 'opp-7', title: 'CRM Implementation', contactName: 'Charlie Brown', value: 7000, stageId: 'stage-2', lastUpdate: '4 days ago' },
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