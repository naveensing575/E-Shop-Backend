import { Product } from './entities/Product';

export interface ProductRepository {
  getAllProducts(page: number, limit: number): Promise<{ products: Product[], totalCount: number, totalPages: number }>;
  getProductById(productId: number): Promise<Product | null>;
  getAllCategories(): Promise<string[]>;
  updateProduct(productId: number, productData: Partial<Product>): Promise<Product | null>;
  deleteProduct(productId: number): Promise<boolean>;
}
