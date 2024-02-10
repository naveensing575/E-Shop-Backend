import { Request, Response } from 'express';
import CartService from '../../application/cartServices';

export const cartController = {
  getCart: async (req: Request | any, res: Response) => {
    const userId = req.extractedUser.userId;
    try {
      const cartItems = await CartService.getCart(userId);
      res.json(cartItems);
    } catch (error) {
      console.error('Error getting cart:', error);
      res.status(500).json({ error: 'Failed to fetch cart items' });
    }
  },

  addToCart: async (req: Request | any, res: Response) => {
    const userId = req.extractedUser.userId;
    const { productId, quantity } = req.body;
    try {
      const cartItem = await CartService.addToCart(userId, productId, quantity);
      res.json(cartItem);
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ error: 'Failed to add item to cart' });
    }
  },

  updateCartItem: async (req: Request, res: Response) => {
    const { quantity, productId } = req.body;
    try {
      const updatedCartItem = await CartService.updateCartItem(productId, quantity);
      res.json(updatedCartItem);
    } catch (error) {
      console.error('Error updating cart item:', error);
      res.status(500).json({ error: 'Failed to update cart item' });
    }
  },

  removeFromCart: async (req: Request, res: Response) => {
    const { productId } = req.body;
    try {
      await CartService.removeFromCart(productId);
      res.sendStatus(204);
    } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({ error: 'Failed to remove item from cart' });
    }
  },
};
