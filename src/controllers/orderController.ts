import { Request, Response } from 'express';
import { createOrder, getPurchaseHistory, sendOrderConfirmationEmail, getOrderDetailById } from '../services/orderService';

async function handleCreateOrder(req: Request | any, res: Response) {
  try {
    const { userId } = req.extractedUser;
    const { products }: { products: Array<{ productId: number; quantity: number; subtotal: number }> } = req.body;

    const result = await createOrder(userId, products);
    await sendOrderConfirmationEmail(userId);
    return res.status(201).json(result);
  } catch (error) {
    console.error('Error in creating order:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleGetOrderById(req: Request | any, res: Response) {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    const { userId } = req.extractedUser;
    const orderDetail = await getOrderDetailById(userId, orderId);
    if (!orderDetail) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.status(200).json(orderDetail);
  } catch (error) {
    console.error('Error fetching order detail:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handlePurchaseHistory(req: Request | any, res: Response) {
  try {
    const userId = req.extractedUser.userId;
    const purchaseHistory = await getPurchaseHistory(userId);
    return res.status(200).json(purchaseHistory);
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export { handleCreateOrder, handlePurchaseHistory, handleGetOrderById };
