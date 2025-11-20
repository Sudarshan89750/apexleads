import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, ContactEntity, OpportunityEntity, PipelineStageEntity, AppointmentEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { MOCK_DASHBOARD_STATS, MOCK_CHART_DATA } from "@shared/mock-data";
import type { Contact, Opportunity, Appointment } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // ApexLeads Routes
  app.get('/api/dashboard-stats', (c) => ok(c, MOCK_DASHBOARD_STATS));
  app.get('/api/revenue-chart', (c) => ok(c, MOCK_CHART_DATA));
  // Appointments CRUD
  app.get('/api/appointments', async (c) => {
    await AppointmentEntity.ensureSeed(c.env);
    const { items } = await AppointmentEntity.list(c.env);
    return ok(c, items);
  });
  app.post('/api/appointments', async (c) => {
    const body = await c.req.json<Omit<Appointment, 'id'>>();
    if (!body.title || !body.date || !body.startTime || !body.endTime) {
      return bad(c, 'Title, date, start time, and end time are required');
    }
    const newAppointment: Appointment = {
      id: crypto.randomUUID(),
      ...body,
    };
    const created = await AppointmentEntity.create(c.env, newAppointment);
    return ok(c, created);
  });
  app.put('/api/appointments/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json<Partial<Appointment>>();
    const appointment = new AppointmentEntity(c.env, id);
    if (!(await appointment.exists())) {
      return notFound(c, 'Appointment not found');
    }
    await appointment.patch(body);
    const updatedAppointment = await appointment.getState();
    return ok(c, updatedAppointment);
  });
  app.delete('/api/appointments/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await AppointmentEntity.delete(c.env, id);
    if (!deleted) {
      return notFound(c, 'Appointment not found');
    }
    return ok(c, { id, deleted: true });
  });
  // Opportunities & Stages
  app.get('/api/opportunities', async (c) => {
    await OpportunityEntity.ensureSeed(c.env);
    await PipelineStageEntity.ensureSeed(c.env);
    const [{ items: opportunities }, { items: stages }] = await Promise.all([
      OpportunityEntity.list(c.env),
      PipelineStageEntity.list(c.env),
    ]);
    return ok(c, { opportunities, stages });
  });
  app.post('/api/opportunities', async (c) => {
    const body = await c.req.json<Omit<Opportunity, 'id' | 'createdAt' | 'lastUpdate'>>();
    if (!body.title || !body.contactName || !body.stageId) {
      return bad(c, 'Title, Contact Name, and Stage are required');
    }
    const now = new Date().toISOString();
    const newOpportunity: Opportunity = {
      id: crypto.randomUUID(),
      ...body,
      value: body.value || 0,
      createdAt: now,
      lastUpdate: now,
    };
    const created = await OpportunityEntity.create(c.env, newOpportunity);
    return ok(c, created);
  });
  app.put('/api/opportunities/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json<Partial<Opportunity>>();
    const opportunity = new OpportunityEntity(c.env, id);
    if (!(await opportunity.exists())) {
      return notFound(c, 'Opportunity not found');
    }
    const updatePayload = { ...body, lastUpdate: new Date().toISOString() };
    await opportunity.patch(updatePayload);
    const updatedOpportunity = await opportunity.getState();
    return ok(c, updatedOpportunity);
  });
  app.delete('/api/opportunities/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await OpportunityEntity.delete(c.env, id);
    if (!deleted) {
      return notFound(c, 'Opportunity not found');
    }
    return ok(c, { id, deleted: true });
  });
  // Contacts CRUD
  app.get('/api/contacts', async (c) => {
    await ContactEntity.ensureSeed(c.env);
    const { items } = await ContactEntity.list(c.env);
    return ok(c, items);
  });
  app.post('/api/contacts', async (c) => {
    const body = await c.req.json<Omit<Contact, 'id' | 'createdAt'>>();
    if (!body.name || !body.email) {
      return bad(c, 'Name and email are required');
    }
    const newContact: Contact = {
      id: crypto.randomUUID(),
      ...body,
      createdAt: new Date().toISOString(),
    };
    const created = await ContactEntity.create(c.env, newContact);
    return ok(c, created);
  });
  app.put('/api/contacts/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json<Partial<Contact>>();
    const contact = new ContactEntity(c.env, id);
    if (!(await contact.exists())) {
      return notFound(c, 'Contact not found');
    }
    await contact.patch(body);
    const updatedContact = await contact.getState();
    return ok(c, updatedContact);
  });
  app.delete('/api/contacts/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await ContactEntity.delete(c.env, id);
    if (!deleted) {
      return notFound(c, 'Contact not found');
    }
    return ok(c, { id, deleted: true });
  });
  // Original Template Routes
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'CF Workers Demo' }}));
  // USERS
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await UserEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/users', async (c) => {
    const { name } = (await c.req.json()) as { name?: string };
    if (!name?.trim()) return bad(c, 'name required');
    return ok(c, await UserEntity.create(c.env, { id: crypto.randomUUID(), name: name.trim() }));
  });
  // CHATS
  app.get('/api/chats', async (c) => {
    await ChatBoardEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await ChatBoardEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/chats', async (c) => {
    const { title } = (await c.req.json()) as { title?: string };
    if (!title?.trim()) return bad(c, 'title required');
    const created = await ChatBoardEntity.create(c.env, { id: crypto.randomUUID(), title: title.trim(), messages: [] });
    return ok(c, { id: created.id, title: created.title });
  });
  // MESSAGES
  app.get('/api/chats/:chatId/messages', async (c) => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });
  app.post('/api/chats/:chatId/messages', async (c) => {
    const chatId = c.req.param('chatId');
    const { userId, text } = (await c.req.json()) as { userId?: string; text?: string };
    if (!isStr(userId) || !text?.trim()) return bad(c, 'userId and text required');
    const chat = new ChatBoardEntity(c.env, chatId);
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.sendMessage(userId, text.trim()));
  });
  // DELETE: Users
  app.delete('/api/users/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await UserEntity.delete(c.env, c.req.param('id')) }));
  app.post('/api/users/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    return ok(c, { deletedCount: await UserEntity.deleteMany(c.env, list), ids: list });
  });
  // DELETE: Chats
  app.delete('/api/chats/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await ChatBoardEntity.delete(c.env, c.req.param('id')) }));
  app.post('/api/chats/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    return ok(c, { deletedCount: await ChatBoardEntity.deleteMany(c.env, list), ids: list });
  });
}