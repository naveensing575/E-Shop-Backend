import { OrderDetail, PurchaseHistory } from './entities/Order';

export interface OrderRepository {
  createOrder(userId: number, products: { productId: number; quantity: number; subtotal: number }[]): Promise<any>;
  sendOrderConfirmationEmail(userId: number): Promise<void>;
  getOrderDetailById(userId: number, orderId: number): Promise<{ orderDetails: OrderDetail[] }>;
  getPurchaseHistory(userId: number): Promise<{ purchaseHistory: PurchaseHistory }[]>;
}
