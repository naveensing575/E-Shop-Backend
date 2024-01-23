import { PrismaClient } from '@prisma/client';
import { firebaseAdmin } from '../config/firebaseAdmin';

const prisma = new PrismaClient();

class UserService {
  async registerUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    address: Record<string, any>,
    phoneNumber: string
  ) {
    try {
      // Check the generated types or use Prisma Client directly
      const user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          dateOfBirth,
          address,
          phoneNumber,
        },
      } as any);

      const firebaseUser = await firebaseAdmin.auth().createUser({
        email,
        password,
      });

      console.log('Successfully created Firebase user:', firebaseUser);

      return user;
    } catch (error) {
      console.error(error);
      throw new Error('User registration failed');
    }
  }

  async validateUserToken(idToken: string): Promise<void> {
    try {
      await firebaseAdmin.auth().verifyIdToken(idToken);
    } catch (error) {
      console.error(error);
      throw new Error('Invalid ID token');
    }
  }

  async logoutUser(uid: string): Promise<void> {
    try {
      await firebaseAdmin.auth().revokeRefreshTokens(uid);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to log out user');
    }
  }
}

export default new UserService();
