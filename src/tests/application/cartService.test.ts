import { CartService } from '../../application/cartServices';
import { PrismaCartRepository } from '../../infrastructure/PrismaCartRepository';

// Create a concrete implementation of CartRepository
const mockCartRepository = PrismaCartRepository;

describe('CartService', () => {
  afterEach(() => {
    // Reset mock function calls after each test
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('calls getCart method of CartRepository with userId', async () => {
      const userId = 1;
      await CartService.getCart(userId, mockCartRepository);
      expect(mockCartRepository.getCart).toHaveBeenCalledWith(userId);
    });
  });

  describe('addToCart', () => {
    it('calls addToCart method of CartRepository with userId, productId, and quantity', async () => {
      const userId = 1;
      const productId = 123;
      const quantity = 2;
      await CartService.addToCart(userId, productId, quantity, mockCartRepository);
      expect(mockCartRepository.addToCart).toHaveBeenCalledWith(userId, productId, quantity);
    });
  });

  describe('updateCartItem', () => {
    it('calls updateCartItem method of CartRepository with productId and quantity', async () => {
      const productId = 123;
      const quantity = 2;
      await CartService.updateCartItem(productId, quantity, mockCartRepository);
      expect(mockCartRepository.updateCartItem).toHaveBeenCalledWith(productId, quantity);
    });
  });

  describe('removeFromCart', () => {
    it('calls removeFromCart method of CartRepository with productId', async () => {
      const productId = 123;
      await CartService.removeFromCart(productId, mockCartRepository);
      expect(mockCartRepository.removeFromCart).toHaveBeenCalledWith(productId);
    });
  });
});

export { mockCartRepository };
