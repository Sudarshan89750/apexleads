import type { User, Chat, ChatMessage, Contact, Opportunity, PipelineStage, Appointment, ActivityLog, Workflow, EmailCampaign, Funnel } from './types';
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
export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'act-1', type: 'contact', description: 'New contact "Bob Williams" was added.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), link: '/contacts' },
  { id: 'act-2', type: 'opportunity', description: 'Opportunity "Website Redesign" moved to "Proposal Sent".', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), link: '/opportunities' },
  { id: 'act-3', type: 'appointment', description: 'Appointment "Project Kickoff" scheduled.', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), link: '/calendars' },
  { id: 'act-4', type: 'opportunity', description: 'Opportunity "E-commerce Platform" was won.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), link: '/opportunities' },
  { id: 'act-5', type: 'contact', description: 'Contact "Alice Johnson" status changed to "Active".', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), link: '/contacts' },
];
export const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-1',
    name: 'New Lead Welcome Email',
    trigger: { type: 'contact_created', name: 'When a new contact is created' },
    actions: [{ type: 'send_email', name: 'Send Welcome Email', details: 'Template: Welcome Series #1' }],
    status: 'active',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'wf-2',
    name: 'Follow-up on Demo Request',
    trigger: { type: 'form_submitted', name: 'When "Demo Request" form is submitted' },
    actions: [
      { type: 'add_tag', name: 'Add Tag', details: 'Tag: demo-request' },
      { type: 'send_email', name: 'Send Demo Info', details: 'Template: Demo Follow-up' },
    ],
    status: 'active',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'wf-3',
    name: 'Inactive Lead Nurturing',
    trigger: { type: 'contact_created', name: 'When a contact is inactive for 30 days' },
    actions: [{ type: 'send_email', name: 'Send Re-engagement Email', details: 'Template: Nurture Series #1' }],
    status: 'inactive',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'wf-4',
    name: 'Post-Appointment Follow-up',
    trigger: { type: 'appointment_booked', name: 'After an appointment is booked' },
    actions: [
      { type: 'wait', name: 'Wait', details: '1 hour' },
      { type: 'send_sms', name: 'Send Thank You SMS', details: 'Message: "Thanks for booking!"' },
      { type: 'if_else', name: 'If/Else', details: 'If contact has tag "VIP"' },
    ],
    status: 'active',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
export const MOCK_EMAIL_CAMPAIGNS: EmailCampaign[] = [
  {
    id: 'ec-1',
    name: 'Q3 Product Update',
    subject: 'New Features to Boost Your Productivity!',
    body: '<h1>Hello World</h1><p>This is our new product update.</p>',
    status: 'sent',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    sentAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ec-2',
    name: 'Summer Sale Promotion',
    subject: '☀��� Don\'t Miss Our Summer Sale!',
    body: '<h1>Summer Sale</h1><p>Get 20% off all plans.</p>',
    status: 'draft',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ec-3',
    name: 'Welcome Series - Email 1',
    subject: 'Welcome to ApexLeads!',
    body: '<h1>Welcome!</h1><p>We are glad to have you.</p>',
    status: 'sent',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    sentAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
export const MOCK_FUNNELS: Funnel[] = [
  {
    id: 'fn-1',
    name: 'SaaS Trial Sign Up',
    domain: 'try.apexleads.com',
    steps: [
      { id: 'step-1-1', type: 'page', name: 'Landing Page', path: '/' },
      { id: 'step-1-2', type: 'form', name: 'Sign Up Form', path: '/signup' },
      { id: 'step-1-3', type: 'thank_you', name: 'Thank You Page', path: '/thank-you' },
    ],
    status: 'active',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'fn-2',
    name: 'Ebook Download',
    domain: 'content.apexleads.com',
    steps: [
      { id: 'step-2-1', type: 'page', name: 'Ebook Squeeze Page', path: '/free-guide' },
      { id: 'step-2-2', type: 'upsell', name: 'One-Time Offer', path: '/oto' },
      { id: 'step-2-3', type: 'thank_you', name: 'Download Page', path: '/download' },
    ],
    status: 'inactive',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];