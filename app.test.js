const request = require('supertest');
const { app, server } = require('./app');  // import the app and server

describe('GET /', () => {
  it('should return Hello World', async () => {
    const res = await request(app).get('/');
    expect(res.text).toBe('Hello World!');
    expect(res.statusCode).toBe(200);
  });

  afterAll(() => {
    server.close();  // close the server after tests are done
  });
});
