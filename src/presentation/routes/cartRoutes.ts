import express from 'express';
import { cartController } from '../controllers/cartController';
import authenticate from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authenticate, cartController.getCart);
router.post('/add', authenticate, cartController.addToCart);
router.put('/update/:cartItemId', authenticate, cartController.updateCartItem);
router.delete('/delete/:cartItemId', authenticate, cartController.removeFromCart);

export default router;

