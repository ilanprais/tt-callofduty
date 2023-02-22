import request from 'supertest';
import { Express } from 'express-serve-static-core';

import { start } from "../app";

let server: Express

beforeAll(async () => {
  server = start();
})

describe('GET /health', () => {
  it('should return 200', (done) => {
    request(server).get(`/health`).then((res) => {
      expect(res.statusCode).toEqual(200);
      done();
    });
  });
});
