import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/auth/register';
import loginHandler from '../pages/api/auth/login';

// Mock firebase/app
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

// Mock firebase/auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({
      user: {
        uid: '123',
        email: 'test@example.com',
        getIdToken: jest.fn(() => Promise.resolve('fake-id-token')),
      },
    }),
  ),
}));

describe('Authentication Endpoints', () => {
  it('should register a new user', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: `testuser${Date.now()}@example.com`,
        password: 'password123',
      },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toHaveProperty('uid');
  });

  it('should log in the user', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    });

    await loginHandler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    // Use your actual logic to set the response body in your API endpoint
    expect(JSON.parse(res._getData())).toHaveProperty('uid');
  });

  // ... additional tests ...
});