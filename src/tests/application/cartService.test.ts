import CartService from '../../application/cartServices';
import { PrismaCartRepository } from '../../infrastructure/PrismaCartRepository';

// Mock CartRepository
jest.mock('../../infrastructure/PrismaCartRepository');

describe('CartService', () => {
  describe('getCart', () => {
    it('should call getCart method of the CartRepository', async () => {
      const userId = 1;
      await CartService.getCart(userId);
      expect(PrismaCartRepository.getCart).toHaveBeenCalledWith(userId);
    });
  });

  describe('addToCart', () => {
    it('should call addToCart method of the CartRepository', async () => {
      const userId = 1;
      const productId = 123;
      const quantity = 2;
      await CartService.addToCart(userId, productId, quantity);
      expect(PrismaCartRepository.addToCart).toHaveBeenCalledWith(userId, productId, quantity);
    });
  });

  describe('updateCartItem', () => {
    it('should call updateCartItem method of the CartRepository', async () => {
      const productId = 123;
      const quantity = 2;
      await CartService.updateCartItem(productId, quantity);
      expect(PrismaCartRepository.updateCartItem).toHaveBeenCalledWith(productId, quantity);
    });
  });

  describe('removeFromCart', () => {
    it('should call removeFromCart method of the CartRepository', async () => {
      const productId = 123;
      await CartService.removeFromCart(productId);
      expect(PrismaCartRepository.removeFromCart).toHaveBeenCalledWith(productId);
    });
  });
});
