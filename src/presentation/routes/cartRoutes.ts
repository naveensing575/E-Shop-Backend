import express from 'express';
import { cartController } from '../controllers/cartController';
import authenticate from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management endpoints
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Retrieve user's cart
 *     description: Retrieve the cart items for the authenticated user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of cart items
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.get('/', authenticate, cartController.getCart);

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add item to cart
 *     description: Add an item to the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *                 description: ID of the product to add to cart
 *               quantity:
 *                 type: number
 *                 description: Quantity of the product to add to cart
 *             required:
 *               - itemId
 *               - quantity
 *     responses:
 *       '201':
 *         description: Item successfully added to cart
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.post('/add', authenticate, cartController.addToCart);

/**
 * @swagger
 * /cart/update/{cartItemId}:
 *   put:
 *     summary: Update cart item
 *     description: Update the quantity of a specific item in the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item in the cart to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: New quantity of the item in the cart
 *             required:
 *               - quantity
 *     responses:
 *       '200':
 *         description: Cart item updated successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.put('/update/:cartItemId', authenticate, cartController.updateCartItem);

/**
 * @swagger
 * /cart/delete/{cartItemId}:
 *   delete:
 *     summary: Remove item from cart
 *     description: Remove a specific item from the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item in the cart to remove
 *     responses:
 *       '200':
 *         description: Cart item removed successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.delete('/delete/:cartItemId', authenticate, cartController.removeFromCart);

export default router;
