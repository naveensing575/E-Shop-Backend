import express from 'express';
import authenticate from '../middlewares/authMiddleware';
import { handleCreateOrder, handleGetOrderById, handlePurchaseHistory } from '../controllers/orderController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order management endpoints
 */

/**
 * @swagger
 * /orders/create:
 *   post:
 *     summary: Create an order
 *     description: Create a new order for the authenticated user
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Add properties here if needed for the request body
 *             required:
 *               // Add required properties here if needed
 *     responses:
 *       '201':
 *         description: Order created successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.post('/create', authenticate, handleCreateOrder);

/**
 * @swagger
 * /orders/history:
 *   get:
 *     summary: Get purchase history
 *     description: Retrieve the purchase history of the authenticated user
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of orders
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.get('/history', authenticate, handlePurchaseHistory); 

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Get order by ID
 *     description: Retrieve a specific order by its ID
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to retrieve
 *     responses:
 *       '200':
 *         description: Order retrieved successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.get('/:orderId', authenticate, handleGetOrderById);

export default router;
