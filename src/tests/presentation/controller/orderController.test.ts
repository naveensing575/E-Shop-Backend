import { Response, NextFunction } from 'express';
import {
  handleCreateOrder,
  handlePurchaseHistory,
  handleGetOrderById,
} from '../../../presentation/controllers/orderController';
import OrderService from '../../../application/orderService';
import CustomRequest from '../../../presentation/typings/types';

jest.mock('../../../application/orderService');

describe('Order Controller', () => {
  let mockRequest: CustomRequest | any;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleCreateOrder', () => {
    it('should create an order and send confirmation email', async () => {
      const mockUserId = 1;
      const mockProducts = [{ id: 1, quantity: 2 }];
      const mockCreatedOrder = { orderId: 123 };

      mockRequest = {
        extractedUser: { userId: mockUserId },
        body: { products: mockProducts },
      };

      (OrderService.createOrder as jest.Mock).mockResolvedValue(mockCreatedOrder);
      (OrderService.sendOrderConfirmationEmail as jest.Mock).mockResolvedValue(mockCreatedOrder);

      await handleCreateOrder(mockRequest, mockResponse as Response, mockNext);

      expect(OrderService.createOrder).toHaveBeenCalledWith(mockUserId, mockProducts);
      expect(OrderService.sendOrderConfirmationEmail).toHaveBeenCalledWith(mockUserId);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedOrder);
    });

    it('should handle errors during order creation', async () => {
    const mockError = new Error('Failed to create order');

    mockRequest = {
      extractedUser: { userId: 1 },
      body: { products: [{ id: 1, quantity: 2 }] },
    };

    (OrderService.createOrder as jest.Mock).mockRejectedValueOnce(mockError);

    await handleCreateOrder(mockRequest, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });

  it('should handle "User not authenticated" error', async () => {
    const mockRequest = {
      body: {},
    };

    await handleCreateOrder(mockRequest as any, mockResponse as any, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User not authenticated' });
    });
  });

  describe('handleGetOrderById', () => {
    it('should fetch order detail by ID', async () => {
      const mockUserId = 1;
      const mockOrderId = '123';
      const mockOrderDetail = { orderId: mockOrderId };

      mockRequest = {
        extractedUser: { userId: mockUserId },
        params: { orderId: mockOrderId },
      };

      (OrderService.getOrderDetailById as jest.Mock).mockResolvedValue(mockOrderDetail);

      await handleGetOrderById(mockRequest, mockResponse as Response, mockNext);

      expect(OrderService.getOrderDetailById).toHaveBeenCalledWith(mockUserId, parseInt(mockOrderId, 10));
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockOrderDetail);
    });

    it('should handle order not found', async () => {
      const mockUserId = 1;
      const mockOrderId = '123';

      mockRequest = {
        extractedUser: { userId: mockUserId },
        params: { orderId: mockOrderId },
      };

      (OrderService.getOrderDetailById as jest.Mock).mockResolvedValue(null);

      await handleGetOrderById(mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Order not found' });
    });

    it('should handle errors during order retrieval', async () => {
      const mockError = new Error('Failed to fetch order detail');

      mockRequest = {
        extractedUser: { userId: 1 },
        params: { orderId: '123' },
      };

      (OrderService.getOrderDetailById as jest.Mock).mockRejectedValueOnce(mockError);

      await handleGetOrderById(mockRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    it('should handle "User not authenticated" error', async () => {
    const mockRequest = {
      body: {},
    };

    await handleGetOrderById(mockRequest as any, mockResponse as any, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User not authenticated' });
    });
  });

  describe('handlePurchaseHistory', () => {
     it('should fetch purchase history', async () => {
    const mockUserId = 1;
    const mockPurchaseHistory = [mockUserId];

    mockRequest = { extractedUser: { userId: mockUserId } };

    (OrderService.getPurchaseHistory as jest.Mock).mockResolvedValue(mockPurchaseHistory);

    await handlePurchaseHistory(mockRequest, mockResponse as Response, mockNext);

    expect(OrderService.getPurchaseHistory).toHaveBeenCalledWith(mockUserId);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockPurchaseHistory);
  });

    it('should handle errors during purchase history retrieval', async () => {
      const mockError = new Error('Failed to fetch purchase history');

      mockRequest = { extractedUser: { userId: 1 } };

      (OrderService.getPurchaseHistory as jest.Mock).mockRejectedValueOnce(mockError);

      await handlePurchaseHistory(mockRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    it('should handle "User not authenticated" error', async () => {
    const mockRequest = {
      body: {},
    };

    await handlePurchaseHistory(mockRequest as any, mockResponse as any, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User not authenticated' });
    });
  });
});
