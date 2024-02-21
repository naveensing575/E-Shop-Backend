import { Request, Response } from 'express';
import UserService from '../../../application/userServices';
import { registerUser, loginUserHandler } from '../../../presentation/controllers/userController';

// Mock UserService
jest.mock('../../../application/userServices');

describe('User Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a user successfully', async () => {
      const mockUserData = { username: 'testuser', password: 'testpassword' };
      const mockRegisteredUser = { id: 1, username: 'testuser' };

      (UserService.registerUser as jest.Mock).mockResolvedValueOnce(mockRegisteredUser);

      req.body = mockUserData;
      await registerUser(req as Request, res as Response);

      expect(UserService.registerUser).toHaveBeenCalledWith(mockUserData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully', user: mockRegisteredUser });
    });

    it('should handle registration errors', async () => {
      const mockError = new Error('Registration failed');
      (UserService.registerUser as jest.Mock).mockRejectedValueOnce(mockError);

      await registerUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('loginUserHandler', () => {
    it('should log in a user successfully', async () => {
      await loginUserHandler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User logged in successfully' });
    });

  });
});
