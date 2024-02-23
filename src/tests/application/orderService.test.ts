import OrderService from '../../application/orderService';
import PrismaOrderRepository from '../../infrastructure/PrismaOrderRepository';

// Mock OrderRepository
jest.mock('../../infrastructure/PrismaOrderRepository');

describe('OrderService', () => {
  const orderService = OrderService;

  describe('createOrder', () => {
    it('should call createOrder method of the OrderRepository', async () => {
      const userId = 1;
      const products = [{ productId: 123, quantity: 2, subtotal: 100 }];
      await orderService.createOrder(userId, products);
      expect(PrismaOrderRepository.createOrder).toHaveBeenCalledWith(userId, products);
    });
  });

  describe('sendOrderConfirmationEmail', () => {
    it('should call sendOrderConfirmationEmail method of the OrderRepository', async () => {
      const userId = 1;
      await orderService.sendOrderConfirmationEmail(userId);
      expect(PrismaOrderRepository.sendOrderConfirmationEmail).toHaveBeenCalledWith(userId);
    });
  });

  describe('getOrderDetailById', () => {
    it('should call getOrderDetailById method of the OrderRepository', async () => {
      const userId = 1;
      const orderId = 123;
      await orderService.getOrderDetailById(userId, orderId);
      expect(PrismaOrderRepository.getOrderDetailById).toHaveBeenCalledWith(userId, orderId);
    });
  });

  describe('getPurchaseHistory', () => {
    it('should call getPurchaseHistory method of the OrderRepository', async () => {
      const userId = 1;
      await orderService.getPurchaseHistory(userId);
      expect(PrismaOrderRepository.getPurchaseHistory).toHaveBeenCalledWith(userId);
    });
  });
});
