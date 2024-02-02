import { Request, Response } from 'express';
import orderService from '../services/orderService';

async function handleCreateOrder(req: Request | any, res: Response) {
  try {
    const {userId, email} = req.extractedUser;
    const { products }: { products: Array<{ productId: number; quantity: number; subtotal: number }> } = req.body;

    const result = await orderService.createOrder(email, userId, products);
    await orderService.sendOrderConfirmationEmail(email, result.order, products);
    return res.status(201).json(result);
  } catch (error) {
    console.error('Error in creating order:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handlePurchaseHistory(req: Request | any, res: Response) {
  try {
    const userId = req.extractedUser.userId;
    const purchaseHistory = await orderService.getPurchaseHistory(userId);
    return res.status(200).json(purchaseHistory);
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export { handleCreateOrder, handlePurchaseHistory };
