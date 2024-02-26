import { CartItem } from './entities/CartItem';

export interface CartRepository {
  getCart(userId: number): Promise<{ message: string; cartItems: CartItem[] }>;
  addToCart(userId: number, productId: number, quantity: number): Promise<any>;
  updateCartItem(productId: number, quantity: number): Promise<CartItem>;
  removeFromCart(productId: number): Promise<void>;
}
