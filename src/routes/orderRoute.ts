import express from 'express';
import authenticate from '../middlewares/authMiddleware';
import handleCreateOrder from '../controllers/orderController';

const router = express.Router();

router.post('/create', authenticate, handleCreateOrder);

export default router;
