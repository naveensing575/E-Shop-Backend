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

      await cartController.getCart(req, res);

      expect(mockedCartService.getCart).toHaveBeenCalledWith('mockUserId');
      expect(res.json).toHaveBeenCalledWith({ message: 'Cart items retrieved successfully', cartItems });
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch cart items');
      mockedCartService.getCart.mockRejectedValueOnce(error);

      await cartController.getCart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch cart items' });
    });

    it('should handle "User not authenticated" error', async () => {
    const req = {
      body: {},
    };

    await cartController.getCart(req as any, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not authenticated' });
    });
  });

  describe('addToCart', () => {
    it('should add item to cart', async () => {
      req.body.productId = 1;
      req.body.quantity = 2;
      const cartItem = { cartItemId: 1, productId: 1, shoppingCartId: 1, name: 'Product 1', quantity: 2 };
      mockedCartService.addToCart.mockResolvedValueOnce({ message: 'Item added to cart successfully', cartItem });

      await cartController.addToCart(req, res);

      expect(mockedCartService.addToCart).toHaveBeenCalledWith('mockUserId', 1, 2);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item added to cart successfully', cartItem });
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to add item to cart');
      mockedCartService.addToCart.mockRejectedValueOnce(error);

      await cartController.addToCart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add item to cart' });
    });

    it('should handle "User not authenticated" error', async () => {
    const req = {
      body: {},
    };

    await cartController.addToCart(req as any, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not authenticated' });
    });
  });

 describe('updateCartItem', () => {
  it('should update the quantity of an item in the cart', async () => {
    req.body.productId = 1;
    req.body.quantity = 3;
    const updatedCartItem = { cartItemId: 1, productId: 1, shoppingCartId: 1, name: 'Product 1', quantity: 3 };
    mockedCartService.updateCartItem.mockResolvedValueOnce(updatedCartItem);

    await cartController.updateCartItem(req, res, next)

    expect(mockedCartService.updateCartItem).toHaveBeenCalledWith(1, 3);
    expect(res.json).toHaveBeenCalledWith(updatedCartItem);
  });

  it('should handle errors', async () => {
    const error = new Error('Failed to update cart item');
    mockedCartService.updateCartItem.mockRejectedValueOnce(error);

    await cartController.updateCartItem(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    });
});

describe('removeFromCart', () => {
  it('should remove an item from the cart', async () => {
    req.body.productId = 1;
    await cartController.removeFromCart(req, res)

    expect(mockedCartService.removeFromCart).toHaveBeenCalledWith(1);
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  it('should handle errors', async () => {
      const error = new Error('Failed to remove item from cart');
      mockedCartService.removeFromCart.mockRejectedValueOnce(error);

      await cartController.removeFromCart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to remove item from cart' });
    });
  });
});
