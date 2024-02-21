import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../domain/UserRepository';
import { User } from '../domain/entities/User';
import { firebaseAdmin } from '../config/firebaseAdmin';
import { UserData } from '../presentation/typings/userInterface';

const prisma = new PrismaClient();

class PrismaUserRepository implements UserRepository {
  async registerUser(userData: UserData): Promise<User> {
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
            create: {
              flat,
              street,
              city,
              country,
              zipcode,
            },
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
}

export default new PrismaUserRepository();
