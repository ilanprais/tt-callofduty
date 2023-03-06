import request from 'supertest';
import { Express } from 'express';
import { getServer } from '../app';

let server: Readonly<Express>;

describe('/health routes', () => {
  beforeAll(async () => {
    server = getServer();
  });

  describe('GET /health', () => {
    test('should return 200', async () => {
      const res = await request(server).get(`/health`);

      expect(res.statusCode).toEqual(200);
    });
  });
});
