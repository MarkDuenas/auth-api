'use strict';


const supergoose = require('@code-fellows/supergoose');
const server = require('../src/server.js')
const mockRequest = supergoose(server.app);
process.env.SECRET = 'secret';


let user = {
  username: 'jake',
  password: '12345',
  role: 'admin'
}

let shirt = {
  name: 'Shirt',
  color: 'Blue',
  size: 'Medium'
}

let hat = {
  name: 'Hat',
  color: 'Red',
  size: 'OS'
}

describe('v2 ROUTE TESTS', () => {

  it('should create a new user and send an object with the user and the token to the client', async () => {
    const responseA = await mockRequest.post('/signup').send(user)
    const responseB = await mockRequest.post('/api/v2/clothes')
     .send(shirt)
     .set('Authorization', `Bearer ${responseA.body.token}`)
      expect(responseB.status).toBe(201);
      expect(responseB.body).toBeDefined();
  });

  it('should sign in with basic authentication headers logs in a user and sends an object with the user and the token to the client', async () => {
    const response = await mockRequest.post('/signin')
      .auth('jake','12345')
      expect(response.body).toBeDefined();
      expect(response.body.token).toBeDefined();
  });

  it('should return a list of :model items', async () => {
    const responseA = await mockRequest.post('/signin')
      .auth('jake','12345')
    const responseB = await mockRequest.get('/api/v2/clothes')
      .set('Authorization', `Bearer ${responseA.body.token}`)
      expect(responseB.body).toBeDefined();
  });

  it('should return an updated item', async () => {
    const responseA = await mockRequest.post('/signin')
      .auth('jake','12345')
    const responseB = await mockRequest.get('/api/v2/clothes')
      .set('Authorization', `Bearer ${responseA.body.token}`)
      expect(responseB.body).toBeDefined();
    const responseC = await mockRequest.put(`/api/v2/clothes/${responseB.body[0]._id}`)
      .send(hat)
      .set('Authorization', `Bearer ${responseA.body.token}`)
      expect(responseC.body.name).toBe('Hat');
  });

  it('should return the deleted item', async () => {
    const responseA = await mockRequest.post('/signin')
      .auth('jake','12345')
    const responseB = await mockRequest.get('/api/v2/clothes')
      .set('Authorization', `Bearer ${responseA.body.token}`)
      expect(responseB.body).toBeDefined();
    const responseC = await mockRequest.delete(`/api/v2/clothes/${responseB.body[0]._id}`)
      .set('Authorization', `Bearer ${responseA.body.token}`)
      expect(responseC.body).toBeDefined();
  })
})
