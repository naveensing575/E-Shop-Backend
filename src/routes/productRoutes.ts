import express from 'express';
import ProductController from '../controllers/productController';

const router = express.Router();

router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
// router.put('/:productId', ProductController.updateProduct);
// router.delete('/:productId', ProductController.deleteProduct);

export default router;
