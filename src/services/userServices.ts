import { PrismaClient } from '@prisma/client';
import { firebaseAdmin } from '../config/firebaseAdmin';

const prisma = new PrismaClient();

class UserService {
  async registerUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    address: {
      flat: string;
      street: string;
      city: string;
      country: string;
      zipcode: string;
    };
    phoneNumber: string;
  }) {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
        address,
        phoneNumber,
      } = userData;


      const { flat, street, city, country, zipcode } = address;

      console.log('User data:', {
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
        address,
        phoneNumber,
      });

      const user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          dateOfBirth,
          address: {
            flat,
            street,
            city,
            country,
            zipcode,
          },
          phoneNumber,
        },
      });

      const firebaseUser = await firebaseAdmin.auth().createUser({
        email,
        password,
      });

      console.log('Successfully created Firebase user:', firebaseUser);

      return user;
    } catch (error) {
      console.error('User registration failed:', error);
      throw new Error('User registration failed');
    }
  }


  async validateUserToken(idToken: string): Promise<void> {
    try {
      await firebaseAdmin.auth().verifyIdToken(idToken);
    } catch (error) {
      console.error('Invalid ID token:', error);
      throw new Error('Invalid ID token');
    }
  }

  async logoutUser(uid: string): Promise<void> {
    try {
      await firebaseAdmin.auth().revokeRefreshTokens(uid);
    } catch (error) {
      console.error('Failed to log out user:', error);
      throw new Error('Failed to log out user');
    }
  }
}

export default new UserService();
