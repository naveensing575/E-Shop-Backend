import { Request, Response, NextFunction } from 'express';
import { cartController } from '../../../presentation/controllers/cartController';
import CartService from '../../../application/cartServices';

const mockedCartService = CartService as jest.Mocked<typeof CartService>;

jest.mock('../../../application/cartServices');

describe('cartController', () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      extractedUser: { userId: 'mockUserId' },
      body: {},
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should return cart items', async () => {
      const cartItems = [
        { cartItemId: 1, productId: 1, shoppingCartId: 1, name: 'Product 1', quantity: 2 }
      ];
      mockedCartService.getCart.mockResolvedValueOnce({ message: 'Cart items retrieved successfully', cartItems });

      await cartController.getCart(req, res, next);

      expect(mockedCartService.getCart).toHaveBeenCalledWith('mockUserId');
      expect(res.json).toHaveBeenCalledWith({ cartItems });
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch cart items');
      mockedCartService.getCart.mockRejectedValueOnce(error);

      await cartController.getCart(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch cart items' });
    });
  });

  describe('addToCart', () => {
    it('should add item to cart', async () => {
      req.body.productId = 1;
      req.body.quantity = 2;
      const cartItem = { cartItemId: 1, productId: 1, shoppingCartId: 1, name: 'Product 1', quantity: 2 };
      mockedCartService.addToCart.mockResolvedValueOnce({ message: 'Item added to cart successfully', cartItem });

      await cartController.addToCart(req, res, next);

      expect(mockedCartService.addToCart).toHaveBeenCalledWith('mockUserId', 1, 2);
      expect(res.json).toHaveBeenCalledWith({ cartItem });
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to add item to cart');
      mockedCartService.addToCart.mockRejectedValueOnce(error);

      await cartController.addToCart(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add item to cart' });
    });
  });

});
