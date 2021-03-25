'use strict';

const supergoose = require('@code-fellows/supergoose');
const server = require('../src/server.js')
const mockRequest = supergoose(server.app);
process.env.SECRET = 'secret';




let user = {
  username: 'jake',
  password: '12345'
}

describe('ROUTE TESTS', () => {
  it('should create a new user and send an object with the user and the token to the client', async () => {
    const response = await mockRequest.post('/signup').send(user)
    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
  });

  it('should sign in with basic authentication headers logs in a user and sends an object with the user and the token to the client', async () => {
    const response = await mockRequest.post('/signin')
    .auth('jake','12345')
    expect(response.body).toBeDefined();
    expect(response.body.token).toBeDefined();
  });
  
})