import { Request, Response } from 'express';
import { createOrder, getPurchaseHistory } from '../services/orderService';

async function handleCreateOrder(req: Request|any, res: Response) {
  try {
    const userId = req.extractedUser.userId;
    const { products }: { products: Array<{ productId: number; quantity: number; subtotal: number }> } = req.body;

    const result = await createOrder(userId, products);
    return res.status(201).json(result);
  } catch (error) {
    console.error('Error in creating order:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handlePurchaseHistory(req: Request|any, res: Response) {
  try {
    const userId = req.extractedUser.userId;
    const purchaseHistory = await getPurchaseHistory(userId);
    return res.status(200).json(purchaseHistory);
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export { handleCreateOrder, handlePurchaseHistory };
