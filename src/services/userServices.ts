import { PrismaClient } from '@prisma/client';
import { firebaseAdmin } from '../config/firebaseAdmin';
import { UserData } from '../typings/userInterface';

const prisma = new PrismaClient();

class UserService {
    async registerUser(userData: UserData) {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        address,
        phoneNumber,
      } = userData;

      const { flat, street, city, country, zipcode } = address;

      const firebaseUser = await firebaseAdmin.auth().createUser({
        email,
        password,
      });

      const user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          address: {
            flat,
            street,
            city,
            country,
            zipcode,
          },
          phoneNumber,
          uid: firebaseUser.uid,
        },
      });

      return user;
    } catch (error) {
      console.error('User registration failed:', error);
      throw new Error('User registration failed');
    }
  }

  async logoutUser(userId: number): Promise<void> {
    try {
      // Retrieve the user from the database based on the user ID
      const user = await prisma.user.findUnique({
        where: {
          userId,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Get the UID from the user data
      const uid = user.uid;

      // Revoke refresh tokens using Firebase Admin SDK
      await firebaseAdmin.auth().revokeRefreshTokens(uid);
    } catch (error) {
      console.error('Failed to log out user:', error);
      throw new Error('Failed to log out user');
    }
  }
}

export default new UserService();
