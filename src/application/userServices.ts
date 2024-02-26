import { UserRepository } from '../domain/UserRepository';
import { User } from '../domain/entities/User';
import { UserData } from '../presentation/typings/userInterface';
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
}

const userService = new UserService(userRepository);

export default userService;
