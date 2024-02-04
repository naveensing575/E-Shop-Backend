import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();
const Prisma = new PrismaClient();

export async function createOrder(userId: number, products: Array<{ productId: number; quantity: number; subtotal: number }>) {
  try {
    const status = 'completed';

    // Create the order
    const order = await Prisma.order.create({
      data: {
        userId,
        status,
      },
    });

    // Create order details
    const orderDetails = await Promise.all(
      products.map(async (product) => {
        const { productId, quantity, subtotal } = product;
        return await Prisma.orderDetail.create({
          data: {
            orderId: order.orderId,
            productId,
            quantity,
            subtotal,
          },
        });
      })
    );

    // Create purchase history
    const purchaseHistory = await Prisma.purchaseHistory.create({
      data: {
        userId,
        active: true,
      },
    });

    // Create purchased products
    const purchasedProducts = await Promise.all(
      products.map(async (product) => {
        const { productId, quantity } = product;
        return await Prisma.purchasedProduct.create({
          data: {
            productId,
            purchaseHistoryId: purchaseHistory.purchaseHistoryId,
            quantity,
            active: true,
          },
        });
      })
    );

    // Clear user's shopping cart
    const userShoppingCart = await Prisma.shoppingCart.findUnique({
      where: {
        userId,
      },
    });

    if (!userShoppingCart) {
      throw new Error('Shopping cart not found for user');
    }

    await Prisma.cartItem.deleteMany({
      where: {
        shoppingCartId: userShoppingCart.shoppingCartId,
      },
    });

    await Prisma.shoppingCart.delete({
      where: {
        userId,
      },
    });

    return { order, orderDetails, purchaseHistory, purchasedProducts };
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Internal Server Error');
  }
}

export async function sendOrderConfirmationEmail(userId: number) {
  try {
    const user = await Prisma.user.findUnique({
      where: {
        userId,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const email = user.email;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "martiallaw107@gmail.com",
        pass: "mjsr unxm tdvy khgr",
      },
    });

    // Fetch purchase history for the user
    const purchaseHistory = await getPurchaseHistory(userId);

    // Check if there is any purchase history
    if (purchaseHistory.length === 0) {
      throw new Error('No purchase history found for the user');
    }

    // Extract the latest order from purchase history
    const latestOrder = purchaseHistory[purchaseHistory.length - 1];

    // Extract purchased products from the latest order
    const purchasedProducts = latestOrder.purchasedProducts;

    // Construct HTML table for product details
    const productTable = `
      <table style="width:100%; border-collapse: collapse;">
        <tr>
          <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Product Name</th>
          <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Quantity</th>
          <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Subtotal</th>
          <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Image</th>
        </tr>
        ${purchasedProducts.map(product => `
          <tr>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${product.product.productName}</td>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${product.quantity}</td>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${product.quantity * product.product.price}</td>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"><img src="${product.product.image}" alt="${product.product.productName}" style="max-width: 100px; max-height: 100px;"></td>
          </tr>
        `).join('')}
      </table>
    `;

    // Construct email body with product table
    const mailOptions = {
      from: 'eshopCustomercare@example.com',
      to: email,
      subject: 'Order Confirmation',
      html: `
        <p>Thank you for your order! Here are your order details:</p>
        ${productTable}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log('Order confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw new Error('Failed to send order confirmation email');
  }
}

export async function getPurchaseHistory(userId: number) {
  try {
    const purchaseHistory = await Prisma.purchaseHistory.findMany({
      where: {
        userId: userId,
        active: true,
      },
      include: {
        purchasedProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    return purchaseHistory;
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    throw new Error('Internal Server Error');
  }
}
