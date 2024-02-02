import { PrismaClient, PurchaseHistory as PurchaseHistoryType, PurchasedProduct as PurchasedProductType, Product as ProductType } from '@prisma/client';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@example.com',
    pass: 'your-password', 
  },
});

const prisma = new PrismaClient();

interface Product {
  productId: number;
  productName: string;
  productDescription: string;
  price: number;
  image: string;
}

interface PurchasedProduct {
  purchasedProductId: number;
  quantity: number;
  product: Product;
}

interface PurchaseHistory {
  purchaseHistoryId: number;
  userId: number;
  purchasedProducts: PurchasedProduct[];
}

export class InvoiceService {
  static async generateAndSendInvoice(userEmail: string, userId: number) {
    try {
      const purchaseHistory = await prisma.purchaseHistory.findFirst({
        where: { userId },
        include: { purchasedProducts: { include: { product: true } } },
      });

      if (!purchaseHistory) {
        throw new Error('No purchase history found for the user.');
      }

      const invoiceHTML = generateInvoiceHTML(purchaseHistory);

      await transporter.sendMail({
        from: 'your-email@example.com',
        to: userEmail,
        subject: 'Invoice',
        html: invoiceHTML,
      });

      console.log('Invoice sent successfully.');
    } catch (error) {
      console.error('Error generating or sending invoice:', error);
      throw new Error('Failed to generate or send invoice.');
    }
  }
}

function generateInvoiceHTML(purchaseHistory: PurchaseHistory) {
  let invoiceHTML = '<h1>Invoice</h1>';
  invoiceHTML += `<p>User ID: ${purchaseHistory.userId}</p>`;
  invoiceHTML += '<h2>Purchased Products:</h2>';
  purchaseHistory.purchasedProducts.forEach((purchasedProduct: PurchasedProduct) => {
    const { product, quantity } = purchasedProduct;
    invoiceHTML += `<p>Product Name: ${product.productName}, Quantity: ${quantity}</p>`;
  });
  return invoiceHTML;
}
