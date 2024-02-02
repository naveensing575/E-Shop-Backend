import { PrismaClient } from '@prisma/client';
import nodemailer, { TransportOptions } from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();
const Prisma = new PrismaClient();

export async function createOrder(email: string, userId: number, products: Array<{ productId: number; quantity: number; subtotal: number }>) {
  try {
    const status = 'completed';
    console.log(email, userId, products, status);
    // Create the order
    const order = await Prisma.order.create({
      data: {
        userId,
        status,
      },
    });

    // Send order confirmation email
    await sendOrderConfirmationEmail(email, order, products);

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

    return { order };
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Internal Server Error');
  }
}

async function sendOrderConfirmationEmail(email: string, order: any, products: Array<{ productId: number; quantity: number; subtotal: number }>) {
  try {

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "martiallaw107@gmail.com",
        pass: "mjsr unxm tdvy khgr",
      },
  })

     // Fetch product details from the database
    const productDetailsPromises = products.map(async (product) => {
      const productDetails = await Prisma.product.findUnique({
        where: {
          productId: product.productId,
        },
      });
      return {
        ...product,
        ...productDetails,
      };
    });

    const productDetails = await Promise.all(productDetailsPromises);

    // Construct HTML table for product details
    const productTable = `
      <table style="width:100%; border-collapse: collapse;">
        <tr>
          <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Product Name</th>
          <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Quantity</th>
          <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Subtotal</th>
          <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Image</th>
        </tr>
        ${productDetails.map(product => `
          <tr>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${product.productName}</td>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${product.quantity}</td>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${product.subtotal}</td>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"><img src="${product.image}" alt="${product.productName}" style="max-width: 100px; max-height: 100px;"></td>
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

export default { createOrder, getPurchaseHistory, sendOrderConfirmationEmail };
