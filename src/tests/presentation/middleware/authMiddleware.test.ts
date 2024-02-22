import { Response, NextFunction } from "express";
import CustomRequest from "../../../presentation/typings/types";
import { firebaseAdmin } from "../../../config/firebaseAdmin";
import { PrismaClient } from '@prisma/client';
import authenticate from '../../../presentation/middlewares/authMiddleware';

const prisma = new PrismaClient();

jest.mock('../../../config/firebaseAdmin', () => ({
  firebaseAdmin: {
    auth: jest.fn(),
  },
}));
jest.mock('@prisma/client');

describe('authenticate middleware', () => {
  let req: CustomRequest;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    req = {
      headers: {},
    } as CustomRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if authorization header is missing', async () => {
    await authenticate(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized - Missing Authorization Header" });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if user is not found in Prisma', async () => {
    req.headers.authorization = 'Bearer invalidtoken';

    (firebaseAdmin.auth().verifyIdToken as jest.Mock).mockRejectedValueOnce(new Error('Invalid token'));

    await authenticate(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Forbidden - Invalid Token" });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if user is unauthorized', async () => {
    const uid = 'validuid';
    const decodedToken = { uid };
    req.headers.authorization = 'Bearer validtoken';

    (firebaseAdmin.auth().verifyIdToken as jest.Mock).mockResolvedValueOnce(decodedToken);
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

    await authenticate(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Forbidden - Unauthorized User" });
    expect(next).not.toHaveBeenCalled();
  });

  it('should set extractedUser in request and call next if authentication is successful', async () => {
    const uid = 'validuid';
    const decodedToken = { uid };
    const user = { uid, name: 'John Doe' };
    req.headers.authorization = 'Bearer validtoken';

    (firebaseAdmin.auth().verifyIdToken as jest.Mock).mockResolvedValueOnce(decodedToken);
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(user);

    await authenticate(req, res as Response, next);

    expect(req.user).toEqual(decodedToken);
    expect(req.extractedUser).toEqual(user);
    expect(next).toHaveBeenCalled();
  });
});
