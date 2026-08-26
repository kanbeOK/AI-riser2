import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../server.ts';

describe('Server API', () => {
  it('GET /api/healthz should return 200 OK', async () => {
    const res = await request(app).get('/api/healthz');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
  
  it('GET /api/readyz should return capability flags', async () => {
    const res = await request(app).get('/api/readyz');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ready');
    expect(res.body.capabilities).toBeDefined();
  });
  
  it('POST /api/scenarios/turn with invalid payload returns 400', async () => {
    const res = await request(app)
      .post('/api/scenarios/turn')
      .send({ invalid: 'data' });
    expect(res.status).toBe(400);
  });
  
  it('POST /api/check/analyze with empty text returns 400', async () => {
    const res = await request(app)
      .post('/api/check/analyze')
      .send({ text: '' });
    expect(res.status).toBe(400);
  });

  it('404 for unknown API routes', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
  });
});
