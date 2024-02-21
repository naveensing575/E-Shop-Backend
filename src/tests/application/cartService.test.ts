import { CartRepository } from '../../domain/CartRepository';
// import { PrismaCartRepository } from '../infrastructure/PrismaCartRepository';
import CartService from '../../application/cartServices';

// Mock the CartRepository
const mockCartRepository: CartRepository = {
  getCart: jest.fn(),
  addToCart: jest.fn(),
  updateCartItem: jest.fn(),
  removeFromCart: jest.fn(),
};

describe('CartService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should call cartRepository.getCart with correct userId', async () => {
      const userId = 123;
      await CartService.getCart(userId, mockCartRepository);
      expect(mockCartRepository.getCart).toHaveBeenCalledWith(userId);
    });
  });

  describe('addToCart', () => {
    it('should call cartRepository.addToCart with correct parameters', async () => {
      const userId = 123;
      const productId = 456;
      const quantity = 2;
      await CartService.addToCart(userId, productId, quantity, mockCartRepository);
      expect(mockCartRepository.addToCart).toHaveBeenCalledWith(userId, productId, quantity);
    });
  });

  describe('updateCartItem', () => {
    it('should call cartRepository.updateCartItem with correct parameters', async () => {
      const productId = 456;
      const quantity = 3;
      await CartService.updateCartItem(productId, quantity, mockCartRepository);
      expect(mockCartRepository.updateCartItem).toHaveBeenCalledWith(productId, quantity);
    });
  });

  describe('removeFromCart', () => {
    it('should call cartRepository.removeFromCart with correct productId', async () => {
      const productId = 456;
      await CartService.removeFromCart(productId, mockCartRepository);
      expect(mockCartRepository.removeFromCart).toHaveBeenCalledWith(productId);
    });
  });
});
