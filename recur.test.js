const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = require('./routes/authRoutes'); // Path to your router
const User = require('./models/user'); // Path to your User model

// Setup a basic express app to host the router for testing
const app = express();
app.use(express.json());
app.use('/', router);

// Mock the User model and JWT
jest.mock('./models/user');
jest.mock('jsonwebtoken');

describe('POST /register', () => {
  const newUser = {
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    username: 'johndoe'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
  });

  it('should register a new user and return a token', async () => {
    // 1. Mock: No existing user found
    User.findOne.mockResolvedValue(null);
    // 2. Mock: User created successfully
    User.create.mockResolvedValue({ _id: '123', username: 'johndoe' });
    // 3. Mock: JWT signing works
    jwt.sign.mockImplementation((payload, secret, options, callback) => {
      callback(null, 'mocked_token_string');
    });

    const res = await request(app)
      .post('/register')
      .send(newUser);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token', 'mocked_token_string');
  });

  it('should return 400 if fields are missing', async () => {
    const res = await request(app)
      .post('/register')
      .send({ email: 'john@example.com' }); // Missing other fields

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('All fields are required');
  });

  it('should return 400 if email or username already exists', async () => {
    // Mock: FindOne actually returns a "user" (meaning it's taken)
    User.findOne.mockResolvedValue({ email: 'john@example.com' });

    const res = await request(app)
      .post('/register')
      .send(newUser);

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('Email or username already in use');
  });

  it('should return 500 if a server error occurs', async () => {
    // Mock a database crash
    User.findOne.mockRejectedValue(new Error('DB failure'));

    const res = await request(app)
      .post('/register')
      .send(newUser);

    expect(res.statusCode).toBe(500);
    expect(res.text).toBe('Server error');
  });
});


describe('POST /login', () => {
  const loginCredentials = {
    email: 'john@example.com',
    password: 'password123'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully and return a token', async () => {
    // 1. Mock: User found in DB
    const mockUser = {
      _id: '123',
      username: 'johndoe',
      role: 'user',
      comparePassword: jest.fn().mockResolvedValue(true) // Password matches
    };
    User.findOne.mockResolvedValue(mockUser);

    // 2. Mock: JWT signing
    jwt.sign.mockImplementation((payload, secret, options, callback) => {
      callback(null, 'mocked_login_token');
    });

    const res = await request(app)
      .post('/login')
      .send(loginCredentials);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token', 'mocked_login_token');
    expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
  });

  it('should return 400 if email or password is missing', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'john@example.com' }); // Missing password

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('Email and password are required');
  });

  it('should return 400 for invalid email (user not found)', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/login')
      .send(loginCredentials);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid Credentials');
  });

  it('should return 400 if password does not match', async () => {
    // Mock: User exists but comparePassword returns false
    const mockUser = {
      comparePassword: jest.fn().mockResolvedValue(false)
    };
    User.findOne.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/login')
      .send(loginCredentials);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid Credentials');
  });

  it('should return 500 if server throws an error', async () => {
    User.findOne.mockRejectedValue(new Error('Database crashed'));

    const res = await request(app)
      .post('/login')
      .send(loginCredentials);

    expect(res.statusCode).toBe(500);
    expect(res.text).toBe('Server error');
  });
});

