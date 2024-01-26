import { PrismaClient } from '@prisma/client';

interface ProductRequest {
  productName?: string;
  categoryId?: number;
  price?: number;
  active?: boolean;
}

const prisma = new PrismaClient();

export class ProductService {
  async getAllProducts() {
    try {
      const products = await prisma.product.findMany();
      return products;
    } catch (error: any) {
      throw new Error(`Error retrieving products: ${error.message}`);
    }
  }

  async getProductById( productId: number) {
    try{
      const product = await prisma.product.findUnique( {
        where: { productId },
      });
      return product;

    } catch (error: any) {
      throw new Error(`Error retrieving product: ${error.message}`);
    }
  }
  async updateProduct(productId: number, productData: ProductRequest) {
    try {
      const updatedProduct = await prisma.product.update({
        where: { productId },
        data: productData,
      });
      return updatedProduct;
    } catch (error: any) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  async deleteProduct(productId: number) {
    try {
      const deletedProduct = await prisma.product.delete({
        where: { productId },
      });
      return deletedProduct;
    } catch (error: any) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }
}

export default new ProductService();
