import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from './server.js';

describe('Server API Endpoints', () => {
  let app: any;
  
  beforeAll(() => {
    app = createApp();
  });

  it('1. /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('2. /api/readyz returns ready', async () => {
    const res = await request(app).get('/api/readyz');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ready' });
  });

  it('3. /api/scenarios/turn with invalid payload returns 400', async () => {
    const res = await request(app).post('/api/scenarios/turn').send({});
    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Invalid request payload');
  });

  it('4. /api/scenarios/turn with invalid scenarioId returns 400', async () => {
    const res = await request(app).post('/api/scenarios/turn').send({
      scenarioId: 'invalid_id',
      userMessage: 'hello'
    });
    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Invalid scenario');
  });

  it('5. /api/scenarios/turn with valid payload returns fallback if no API key', async () => {
    const res = await request(app).post('/api/scenarios/turn').send({
      scenarioId: 'c1_qr_delivery',
      userMessage: 'hello'
    });
    expect(res.status).toBe(200);
    expect(['gemini', 'deterministic_fallback']).toContain(res.body.source);
    expect(res.body.message).toBeDefined();
    expect(res.body.tactic).toBeDefined();
    expect(res.body.pressureDelta).toBeDefined();
  });

  it('6. 404 for unknown API endpoints', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
  });
});
