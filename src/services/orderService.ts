import { PrismaClient } from '@prisma/client';

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

export default { createOrder, getPurchaseHistory };