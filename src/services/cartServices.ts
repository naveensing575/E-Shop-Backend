import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const cartService = {
  getCart: async (userId: number) => {
    try {
      // Find the user's shopping cart
      const shoppingCart = await prisma.shoppingCart.findUnique({
        where: { userId: userId },
      });

      if (!shoppingCart) {
        throw new Error('Shopping cart not found');
      }

      const cartItems = await prisma.cartItem.findMany({
        where: { shoppingCartId: shoppingCart.shoppingCartId },
        include: { product: true },
      });

      return cartItems;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw new Error('Failed to fetch cart items');
    }
  },

addToCart: async (userId: number, productId: number, quantity: number) => {
    try {
      // Find the user's shopping cart
      let shoppingCart = await prisma.shoppingCart.findUnique({
        where: { userId },
        include: { CartItem: true },
      });

      if (!shoppingCart) {
        // If the shopping cart doesn't exist, create it
        shoppingCart = await prisma.shoppingCart.create({
          data: { userId, active: true },
          include: { CartItem: true },
        });
      }

      // Check if the product is already in the cart
      const existingCartItem = shoppingCart.CartItem.find(item => item.productId === productId);

      if (existingCartItem) {
        // If the product is already in the cart, update the quantity
        await prisma.cartItem.update({
          where: { cartItemId: existingCartItem.cartItemId },
          data: { quantity: existingCartItem.quantity + quantity },
        });
      } else {
        // If the product is not in the cart, create a new cart item
        await prisma.cartItem.create({
          data: { quantity, productId, shoppingCartId: shoppingCart.shoppingCartId },
        });
      }

      // Fetch the updated shopping cart with cart items
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


  updateCartItem: async (cartItemId: number, quantity: number) => {
    try {
      const updatedCartItem = await prisma.cartItem.update({
        where: { cartItemId },
        data: { quantity },
      });
      return updatedCartItem;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw new Error('Failed to update cart item');
    }
  },

  removeFromCart: async (cartItemId: number) => {
    try {
      await prisma.cartItem.delete({ where: { cartItemId } });
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw new Error('Failed to remove item from cart');
    }
  },
};