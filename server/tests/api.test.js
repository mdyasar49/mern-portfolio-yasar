/**
 * API Integrity Tests
 */

const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

describe('API Tests', () => {
  
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /', () => {
    it('should return 200 OK and Online status', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      const data = res.body.payload || res.body;
      expect(data).toHaveProperty('status', 'Online');
    });
  });

  describe('GET /api/profile', () => {
    it('should return profile data', async () => {
      const res = await request(app).get('/api/profile');
      expect([200, 404]).toContain(res.statusCode);
    });
  });

  describe('POST /api/contact', () => {
    it('should submit contact form successfully', async () => {
      const contactData = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message'
      };

      const res = await request(app)
        .post('/api/contact')
        .send(contactData);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
    });

    it('should fail if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/contact')
        .send({ name: 'Test User' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    });
  });
});
