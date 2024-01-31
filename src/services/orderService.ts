import { PrismaClient } from '@prisma/client';

const Prisma = new PrismaClient();

export async function createOrder(userId: number, products: Array<{ productId: number; quantity: number; subtotal: number }>) {
  try {

    const status = 'completed';

    const order = await Prisma.order.create({
      data: {
        userId,
        status,
      },
    });

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

    const userShoppingCart = await Prisma.shoppingCart.findUnique({
      where: {
        userId: userId,
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
        userId: userId,
      },
    });

    return { order, orderDetails };
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Internal Server Error');
  }
}
