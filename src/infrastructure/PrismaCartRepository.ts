import { PrismaClient } from '@prisma/client';
import { CartRepository } from '../domain/CartRepository';

const prisma = new PrismaClient();

export const PrismaCartRepository: CartRepository = {
  async getCart(userId: number) {
    try {
    const shoppingCart = await prisma.shoppingCart.findUnique({
      where: { userId: userId },
      include: { CartItem: true },
    });

    if (!shoppingCart) {
      // Return an empty array if the shopping cart is not found
      return { message: 'Your Shopping Bag is Empty!!', cartItems: [] };
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { shoppingCartId: shoppingCart.shoppingCartId },
      include: { product: true },
    });

    // Check if the cart is empty
    if (cartItems.length === 0) {
      return { message: 'Your Shopping Bag is Empty!!', cartItems: [] };
    }

    return { message: 'Shopping cart retrieved successfully', cartItems: cartItems };
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw new Error('Failed to fetch cart items');
  }
  },

  async addToCart(userId: number, productId: number, quantity: number) {
    try {
      let shoppingCart = await prisma.shoppingCart.findUnique({
        where: { userId },
        include: { CartItem: true },
      });

      if (!shoppingCart) {
        shoppingCart = await prisma.shoppingCart.create({
          data: { userId, active: true },
          include: { CartItem: true },
        });
      }

      const existingCartItem = shoppingCart.CartItem.find(item => item.productId === productId);

      if (existingCartItem) {
        await prisma.cartItem.update({
          where: { cartItemId: existingCartItem.cartItemId },
          data: { quantity: existingCartItem.quantity + quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: { quantity, productId, shoppingCartId: shoppingCart.shoppingCartId },
        });
      }

      const updatedCart = await prisma.shoppingCart.findUnique({
        where: { shoppingCartId: shoppingCart.shoppingCartId },
        include: { CartItem: true },
      });

      return updatedCart;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw new Error('Failed to add item to cart.');
    }
  },

  async updateCartItem(productId: number, quantity: number) {
    try {
      const cartItem = await prisma.cartItem.findFirst({
        where: { productId },
      });

      if (!cartItem) {
        throw new Error('Cart item not found');
      }

      const updatedCartItem = await prisma.cartItem.update({
        where: { cartItemId: cartItem.cartItemId },
        data: { quantity },
      });

      return updatedCartItem;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw new Error('Failed to update cart item');
    }
  },

  async removeFromCart(productId: number) {
    try {
      const cartItem = await prisma.cartItem.findFirst({
        where: { productId },
      });

      if (!cartItem) {
        throw new Error('Cart item not found');
      }

      await prisma.cartItem.delete({ where: { cartItemId: cartItem.cartItemId } });
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw new Error('Failed to remove item from cart');
    }
  },
};
