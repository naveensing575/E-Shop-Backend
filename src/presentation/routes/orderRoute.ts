import express from 'express';
import authenticate from '../middlewares/authMiddleware';
import { handleCreateOrder, handleGetOrderById, handlePurchaseHistory } from '../controllers/orderController';
const router = express.Router();

router.post('/create', authenticate, handleCreateOrder);
router.get('/history', authenticate, handlePurchaseHistory); 
router.get('/:orderId', authenticate, handleGetOrderById);

export default router;

