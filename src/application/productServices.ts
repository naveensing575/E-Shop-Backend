import { PrismaProductRepository } from '../infrastructure/PrismaProductRepository';
import { Product } from '../domain/entities/Product';

export class ProductService {
  constructor(private readonly productRepository: PrismaProductRepository) {}

  async getAllProducts(page: number, limit: number) {
    return await this.productRepository.getAllProducts(page, limit);
  }

  async getProductById(productId: number) {
    return await this.productRepository.getProductById(productId);
  }

  async getAllCategories() {
    return await this.productRepository.getAllCategories();
  }

  async updateProduct(productId: number, productData: Partial<Product>) {
    return await this.productRepository.updateProduct(productId, productData);
  }

  async deleteProduct(productId: number) {
    return await this.productRepository.deleteProduct(productId);
  }
}

const productService = new ProductService(new PrismaProductRepository());

export default productService;
