/* 
 * Unit tests for authentication routes
 * Tests the register and login endpoints
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Updated path

// Mock User model
jest.mock('../models/User', () => {
    return {
        findOne: jest.fn(),
        create: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn()
    };
});

const User = require('../models/User');

describe('Auth Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                phone: '1234567890',
                role: 'farmer'
            };

            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue({
                _id: '123',
                name: userData.name,
                email: userData.email,
                role: userData.role
            });

            const res = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.user).toHaveProperty('id');
            expect(res.body.user.name).toBe(userData.name);
            expect(res.body.user.email).toBe(userData.email);
            expect(res.body.user.role).toBe(userData.role);
        });

        it('should not register a user with existing email', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                phone: '1234567890',
                role: 'farmer'
            };

            User.findOne.mockResolvedValue({ email: userData.email });

            const res = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('User already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login a user with valid credentials', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'password123'
            };

            const mockUser = {
                _id: '123',
                name: 'Test User',
                email: loginData.email,
                role: 'farmer',
                matchPassword: jest.fn().mockResolvedValue(true),
                save: jest.fn().mockResolvedValue(true)
            };

            User.findOne.mockResolvedValue(mockUser);

            const res = await request(app)
                .post('/api/auth/login')
                .send(loginData);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user).toHaveProperty('id');
            expect(res.body.user.email).toBe(loginData.email);
        });

        it('should not login a user with invalid credentials', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'wrongpassword'
            };

            const mockUser = {
                _id: '123',
                name: 'Test User',
                email: loginData.email,
                role: 'farmer',
                matchPassword: jest.fn().mockResolvedValue(false),
                save: jest.fn().mockResolvedValue(true)
            };

            User.findOne.mockResolvedValue(mockUser);

            const res = await request(app)
                .post('/api/auth/login')
                .send(loginData);

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid credentials');
        });
    });
}); 