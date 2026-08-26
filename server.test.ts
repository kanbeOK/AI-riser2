import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from './server.js';

describe('Server API Endpoints', () => {
  let app: ReturnType<typeof createApp>;
  
  beforeAll(() => {
    app = createApp({ geminiApiKey: null });
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
    expect(res.body.source).toBe('deterministic_fallback');
    expect(res.body.message).toBeDefined();
    expect(res.body.tactic).toBeDefined();
    expect(res.body.pressureDelta).toBeDefined();
    expect(Array.isArray(res.body.clues)).toBe(true);
  });

  it('6. rejects oversized chat history instead of forwarding it', async () => {
    const history = Array.from({ length: 9 }, () => ({
      role: 'user' as const,
      parts: [{ text: 'synthetic message' }]
    }));
    const res = await request(app).post('/api/scenarios/turn').send({
      scenarioId: 'c1_qr_delivery',
      history,
      userMessage: 'hello'
    });
    expect(res.status).toBe(400);
  });

  it('7. keeps the deterministic legitimate scenario non-coercive', async () => {
    const res = await request(app).post('/api/scenarios/turn').send({
      scenarioId: 'c2_legit_shipper',
      userMessage: 'Tôi kiểm tra ở đâu?'
    });
    expect(res.status).toBe(200);
    expect(res.body.source).toBe('deterministic_fallback');
    expect(res.body.tactic).toBe('Xác minh minh bạch');
    expect(res.body.pressureDelta).toBeLessThan(0);
  });

  it('8. 404 for unknown API endpoints', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
  });
});
