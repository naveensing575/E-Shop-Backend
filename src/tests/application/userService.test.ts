import { UserRepository } from '../../domain/UserRepository';
import { UserData } from '../../presentation/typings/userInterface';
import UserService from '../../application/userServices';

const mockUserData: UserData = {
  email: 'test2@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  address: {
    flat: '123',
    street: 'Main St',
    city: 'City',
    country: 'Country',
    zipcode: '12345',
  },
  phoneNumber: '1234567890',
  uid: 'yut12yu12tyu12g1'
};

const userService = UserService;

describe('UserService', () => {
  describe('registerUser', () => {
    it('should register a user successfully', async () => {
      const result = await userService.registerUser(mockUserData);
      expect(result).toBeDefined();
      expect(result.email).toBe(mockUserData.email);
      expect(result.firstName).toBe(mockUserData.firstName);
      expect(result.lastName).toBe(mockUserData.lastName);
      expect(result.address).toEqual(expect.objectContaining(mockUserData.address));
      expect(result.phoneNumber).toBe(mockUserData.phoneNumber);
      expect(result.uid).toBe(mockUserData.uid);
    });

    it('should throw an error when user registration fails', async () => {
      const mockUserRepositoryWithError: UserRepository = {
        async registerUser(userData: UserData) {
          throw new Error('Failed to register user');
        },
      };
      const userServiceWithError = UserService;
      await expect(userServiceWithError.registerUser(mockUserData)).rejects.toThrowError('User registration failed');
    });
  });
});
