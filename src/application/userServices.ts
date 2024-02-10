import { UserRepository } from '../domain/UserRepository';
import { User } from '../domain/entities/User';
import { UserData } from '../typings/userInterface';
import userRepository from '../infrastructure/PrismaUserRepository';

class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(userData: UserData): Promise<User> {
    try {
      const user = await this.userRepository.registerUser(userData);
      return user;
    } catch (error) {
      console.error('User registration failed:', error);
      throw new Error('User registration failed');
    }
  }

  async logoutUser(userId: number): Promise<void> {
    try {
      await this.userRepository.logoutUser(userId);
    } catch (error) {
      console.error('Failed to log out user:', error);
      throw new Error('Failed to log out user');
    }
  }
}

// Instantiate UserService with the PrismaUserRepository
const userService = new UserService(userRepository);

export default userService;
