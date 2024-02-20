import { Response, NextFunction } from 'express';
import CustomRequest from '../../../presentation/typings/types';
import { firebaseAdmin } from '../../../config/firebaseAdmin';
import { PrismaClient } from '@prisma/client';
import authenticateMiddleware from '../../../presentation/middlewares/authMiddleware';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockedPrismaClient = {
    user: { findUnique: jest.fn() }, // Mocking the user property
  };
  return {
    PrismaClient: jest.fn(() => mockedPrismaClient),
  };
});

// Mock firebaseAdmin.auth().verifyIdToken
jest.mock('../../../config/firebaseAdmin', () => ({
  firebaseAdmin: {
    auth: jest.fn(() => ({
      verifyIdToken: jest.fn(),
    })),
  },
}));

describe('authenticate middleware', () => {
  let req: CustomRequest;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer testToken',
      },
    } as CustomRequest;
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    next = jest.fn() as NextFunction;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // it('should call next() if authorization header is present and valid', async () => {
  //   const decodedToken = { uid: 'testUID' };
  //   (firebaseAdmin.auth().verifyIdToken as jest.Mock).mockResolvedValue(decodedToken);
  //   (PrismaClient as jest.MockedClass<typeof PrismaClient>).user.findUnique.mockResolvedValue({ uid: 'testUID' });

  //   await authenticateMiddleware(req, res, next);

  //   expect(firebaseAdmin.auth().verifyIdToken).toHaveBeenCalledWith('testToken');
  //   expect(PrismaClient).toHaveBeenCalledTimes(1); // Ensure PrismaClient constructor is called
  //   expect((PrismaClient as jest.MockedClass<typeof PrismaClient>).user.findUnique).toHaveBeenCalledWith({ where: { uid: 'testUID' } });
  //   expect(req.user).toEqual(decodedToken);
  //   expect(next).toHaveBeenCalled();
  // });

  // it('should return 401 if authorization header is missing', async () => {
  //   delete req.headers.authorization;

  //   await authenticateMiddleware(req, res, next);

  //   expect(res.status).toHaveBeenCalledWith(401);
  //   expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized - Missing Authorization Header' });
  // });

  // it('should return 403 if user is not found in Prisma', async () => {
  //   (firebaseAdmin.auth().verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'testUID' });
  //   (PrismaClient as jest.MockedClass<typeof PrismaClient>).user.findUnique.mockResolvedValue(null);

  //   await authenticateMiddleware(req, res, next);

  //   expect(res.status).toHaveBeenCalledWith(403);
  //   expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden - Unauthorized User' });
  // });

  // it('should return 403 if user UID does not match token UID', async () => {
  //   (firebaseAdmin.auth().verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'testUID' });
  //   (PrismaClient as jest.MockedClass<typeof PrismaClient>).user.findUnique.mockResolvedValue({ uid: 'differentUID' });

  //   await authenticateMiddleware(req, res, next);

  //   expect(res.status).toHaveBeenCalledWith(403);
  //   expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden - Unauthorized User' });
  // });

  it('should return 403 if token verification fails', async () => {
    (firebaseAdmin.auth().verifyIdToken as jest.Mock).mockRejectedValue(new Error('Test error'));

    await authenticateMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden - Invalid Token' });
  });
});
