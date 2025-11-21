const request = require('supertest');
const app = require('../src/app');

describe('Health Check Endpoint', () => {
    it('should return healthy status', async () => {
        const response = await request(app).get('/health');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'healthy');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('uptime');
    });
});

describe('API Root Endpoint', () => {
    it('should return API information', async () => {
        const response = await request(app).get('/api');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('version');
        expect(response.body).toHaveProperty('endpoints');
    });
});
