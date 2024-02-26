import { OrderRepository } from '../domain/OrderRepository';
import PrismaOrderRepository from '../infrastructure/PrismaOrderRepository';

export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async createOrder(userId: number, products: Array<{ productId: number; quantity: number; subtotal: number }>) {
    return await this.orderRepository.createOrder(userId, products);
  }

  async sendOrderConfirmationEmail(userId: number) {
    return await this.orderRepository.sendOrderConfirmationEmail(userId);
  }

  async getOrderDetailById(userId: number, orderId: number) {
    return await this.orderRepository.getOrderDetailById(userId, orderId);
  }

  async getPurchaseHistory(userId: number) {
    return await this.orderRepository.getPurchaseHistory(userId);
  }
}

export default new OrderService(PrismaOrderRepository);
