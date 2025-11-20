/**
 * Minimal real-world demo: One Durable Object instance per entity (User, ChatBoard), with Indexes for listing.
 */
import { IndexedEntity } from "./core-utils";
import type { User, Chat, ChatMessage, Contact, Opportunity, PipelineStage, Appointment, Workflow } from "@shared/types";
import { MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS, MOCK_CONTACTS, MOCK_OPPORTUNITIES, MOCK_PIPELINE_STAGES, MOCK_APPOINTMENTS, MOCK_WORKFLOWS } from "@shared/mock-data";
// USER ENTITY: one DO instance per user
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
// CHAT BOARD ENTITY: one DO instance per chat board, stores its own messages
export type ChatBoardState = Chat & { messages: ChatMessage[] };
const SEED_CHAT_BOARDS: ChatBoardState[] = MOCK_CHATS.map(c => ({
  ...c,
  messages: MOCK_CHAT_MESSAGES.filter(m => m.chatId === c.id),
}));
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  static seedData = SEED_CHAT_BOARDS;
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}
// CONTACT ENTITY: one DO instance per contact
export class ContactEntity extends IndexedEntity<Contact> {
  static readonly entityName = "contact";
  static readonly indexName = "contacts";
  static readonly initialState: Contact = {
    id: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "Lead",
    createdAt: new Date().toISOString(),
  };
  static seedData = MOCK_CONTACTS;
}
// OPPORTUNITY ENTITY
export class OpportunityEntity extends IndexedEntity<Opportunity> {
  static readonly entityName = "opportunity";
  static readonly indexName = "opportunities";
  static readonly initialState: Opportunity = {
    id: "",
    title: "",
    contactName: "",
    value: 0,
    stageId: "",
    lastUpdate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  static seedData = MOCK_OPPORTUNITIES;
}
// PIPELINE STAGE ENTITY
export class PipelineStageEntity extends IndexedEntity<PipelineStage> {
  static readonly entityName = "pipelinestage";
  static readonly indexName = "pipelinestages";
  static readonly initialState: PipelineStage = {
    id: "",
    title: "",
  };
  static seedData = MOCK_PIPELINE_STAGES;
}
// APPOINTMENT ENTITY
export class AppointmentEntity extends IndexedEntity<Appointment> {
  static readonly entityName = "appointment";
  static readonly indexName = "appointments";
  static readonly initialState: Appointment = {
    id: "",
    title: "",
    date: new Date().toISOString().split('T')[0],
    startTime: "09:00",
    endTime: "10:00",
  };
  static seedData = MOCK_APPOINTMENTS;
}
// WORKFLOW ENTITY
export class WorkflowEntity extends IndexedEntity<Workflow> {
  static readonly entityName = "workflow";
  static readonly indexName = "workflows";
  static readonly initialState: Workflow = {
    id: "",
    name: "",
    trigger: { type: 'contact_created', name: 'When a new contact is created' },
    actions: [],
    status: 'inactive',
    createdAt: new Date().toISOString(),
  };
  static seedData = MOCK_WORKFLOWS;
}