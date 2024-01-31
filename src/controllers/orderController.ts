import { Request, Response, NextFunction } from 'express';
import { createOrder } from '../services/orderService';

async function handleCreateOrder(req: Request|any, res: Response, next: NextFunction) {
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

export default  handleCreateOrder 