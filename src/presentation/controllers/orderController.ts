import { Response, NextFunction } from 'express';
import OrderService from '../../application/orderService';
import CustomRequest from '../typings/types';

async function handleCreateOrder(req: CustomRequest, res: Response, next: NextFunction) {
  const { extractedUser } = req;

  if (!extractedUser) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
  }

  try {
    const { userId } = extractedUser;
    const { products } = req.body;

    const result = await OrderService.createOrder(userId, products);
    await OrderService.sendOrderConfirmationEmail(userId);
    return res.status(201).json(result);
  } catch (error) {
    console.error('Error in creating order:', error);
    next(error);
  }
}

async function handleGetOrderById(req: CustomRequest, res: Response, next: NextFunction) {
  const { extractedUser } = req;

    if (!extractedUser) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

  try {
    const { userId } = extractedUser;
    const orderId = parseInt(req.params.orderId, 10);
    const orderDetail = await OrderService.getOrderDetailById(userId, orderId);
    if (!orderDetail) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.status(200).json(orderDetail);
  } catch (error) {
    console.error('Error fetching order detail:', error);
    next(error);
  }
}

async function handlePurchaseHistory(req: CustomRequest, res: Response, next: NextFunction) {
  const { extractedUser } = req;

    if (!extractedUser) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

  try {
    const { userId } = extractedUser;
    const purchaseHistory = await OrderService.getPurchaseHistory(userId);
    return res.status(200).json(purchaseHistory);
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    next(error);
  }
}

export { handleCreateOrder, handlePurchaseHistory, handleGetOrderById };
