import express from 'express';
import ProductController from '../controllers/productController';
import authenticate from '../middlewares/authMiddleware';

const router = express.Router();

//product routes
router.get('/', authenticate, ProductController.getAllProducts);
router.get('/categories', authenticate, ProductController.getAllCategories);
router.get('/:id', authenticate,  ProductController.getProductById);
// router.put('/:productId', ProductController.updateProduct);
// router.delete('/:productId', ProductController.deleteProduct);


export default router;
