import { CartRepository } from '../domain/CartRepository';
import { PrismaCartRepository } from '../infrastructure/PrismaCartRepository';

export class CartService {
  static async getCart(userId: number, cartRepository: CartRepository = PrismaCartRepository) {
    return await cartRepository.getCart(userId);
  }

  static async addToCart(userId: number, productId: number, quantity: number, cartRepository: CartRepository = PrismaCartRepository) {
    return await cartRepository.addToCart(userId, productId, quantity);
  }

  static async updateCartItem(productId: number, quantity: number, cartRepository: CartRepository = PrismaCartRepository) {
    return await cartRepository.updateCartItem(productId, quantity);
  }

  static async removeFromCart(productId: number, cartRepository: CartRepository = PrismaCartRepository) {
    return await cartRepository.removeFromCart(productId);
  }
}

export default CartService;
