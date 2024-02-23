import { PrismaCartRepository } from '../../infrastructure/PrismaCartRepository';

jest.mock('../../infrastructure/PrismaCartRepository');

describe('PrismaCartRepository', () => {
  describe('getCart', () => {
    it('should return shopping cart when it exists', async () => {
      const mockCart = {
        message: 'Shopping cart retrieved successfully',
        cartItems: [{ id: 1, quantity: 2 }],
      };
      (PrismaCartRepository.getCart as jest.Mock).mockResolvedValueOnce(mockCart);

      const result = await PrismaCartRepository.getCart(1);

      expect(result).toEqual(expect.objectContaining({
        message: 'Shopping cart retrieved successfully',
        cartItems: expect.arrayContaining([
          expect.objectContaining({ id: 1, quantity: 2 }),
        ]),
      }));
    });

    it('should return message when shopping cart does not exist', async () => {
      const mockEmptyCart = {
        message: 'Your Shopping Bag is Empty!!',
        cartItems: [],
      };
      (PrismaCartRepository.getCart as jest.Mock).mockResolvedValueOnce(mockEmptyCart);

      const result = await PrismaCartRepository.getCart(1);

      expect(result).toEqual(mockEmptyCart);
    });

    it('should throw error when fetching cart fails', async () => {
      (PrismaCartRepository.getCart as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch cart'));

      await expect(() => PrismaCartRepository.getCart(1)).rejects.toThrowError('Failed to fetch cart');
    });
  });

  describe('addToCart', () => {
    it('should add item to cart', async () => {
      const mockCart = {
        shoppingCartId: 1,
        userId: 1,
        active: true,
        cartItems: [{ cartItemId: 1, productId: 1, quantity: 1 }],
      };
      (PrismaCartRepository.addToCart as jest.Mock).mockResolvedValueOnce(mockCart);

      const result = await PrismaCartRepository.addToCart(1, 2, 1);

      expect(result).toEqual(mockCart);
    });

    it('should update quantity if item already exists in cart', async () => {
      const mockCart = {
        shoppingCartId: 1,
        userId: 1,
        active: true,
        cartItems: [{ cartItemId: 1, productId: 2, quantity: 1 }],
      };
      (PrismaCartRepository.addToCart as jest.Mock).mockResolvedValueOnce(mockCart);

      const result = await PrismaCartRepository.addToCart(1, 2, 1);

      expect(result.cartItems[0].quantity).toEqual(1);
    });

    it('should throw error when adding item to cart fails', async () => {
      (PrismaCartRepository.addToCart as jest.Mock).mockRejectedValueOnce(new Error('Failed to add item to cart'));

      await expect(() => PrismaCartRepository.addToCart(1, 2, 1)).rejects.toThrowError('Failed to add item to cart');
    });
  });

  describe('updateCartItem', () => {
    it('should update quantity of cart item', async () => {
      const mockCartItem = {
        cartItemId: 1,
        productId: 1,
        quantity: 2,
      };
      (PrismaCartRepository.updateCartItem as jest.Mock).mockResolvedValueOnce(mockCartItem);

      const result = await PrismaCartRepository.updateCartItem(1, 2);

      expect(result.quantity).toEqual(2);
    });

    it('should throw error when updating cart item fails', async () => {
      (PrismaCartRepository.updateCartItem as jest.Mock).mockRejectedValueOnce(new Error('Failed to update cart item'));

      await expect(() => PrismaCartRepository.updateCartItem(1, 2)).rejects.toThrowError('Failed to update cart item');
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart', async () => {
      const mockSuccessResponse = {};
      (PrismaCartRepository.removeFromCart as jest.Mock).mockResolvedValueOnce(mockSuccessResponse);

      const result = await PrismaCartRepository.removeFromCart(1);

      expect(result).toEqual({});
    });

    it('should throw error when removing item from cart fails', async () => {
      (PrismaCartRepository.removeFromCart as jest.Mock).mockRejectedValueOnce(new Error('Failed to remove item from cart'));

      await expect(() => PrismaCartRepository.removeFromCart(1)).rejects.toThrowError('Failed to remove item from cart');
    });
  });
});
