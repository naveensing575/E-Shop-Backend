import { PrismaClient } from '@prisma/client';
import { ProductRepository } from '../domain/ProductRepository';
import { Product } from '../domain/entities/Product';

const prisma = new PrismaClient();

export class PrismaProductRepository implements ProductRepository {
  async getAllProducts(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;
      const products = await prisma.product.findMany({
        skip,
        take: limit,
      });
      const totalCount = await prisma.product.count();
      const totalPages = Math.ceil(totalCount / limit);
      return { products, totalCount, totalPages };
    } catch (error: any) {
      throw new Error(`Error retrieving products: ${error.message}`);
    }
  }

  async getProductById(productId: number) {
    try {
      const product = await prisma.product.findUnique({
        where: { productId },
      });
      return product;
    } catch (error: any) {
      throw new Error(`Error retrieving product: ${error.message}`);
    }
  }

  async getAllCategories() {
    try {
      const categories = await prisma.category.findMany();
      return categories.map(category => category.categoryName);
    } catch (error: any) {
      throw new Error(`Error retrieving categories: ${error.message}`);
    }
  }

  async updateProduct(productId: number, productData: Partial<Product>) {
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
      await prisma.product.delete({
        where: { productId },
      });
      return true;
    } catch (error: any) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }
}

export default new PrismaProductRepository();
