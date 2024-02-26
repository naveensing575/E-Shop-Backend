import ProductService from '../../application/productServices';
import { PrismaProductRepository } from '../../infrastructure/PrismaProductRepository';
import { Product } from '../../domain/entities/Product';

jest.mock('../../infrastructure/PrismaProductRepository');

describe('ProductService', () => {
  // Mock product data
  const mockProduct: Partial<Product> = {
  productId: 1,
  productName: 'Mock Product',
  price: 10,
};

  const mockGetAllProducts = jest.fn();
  const mockGetProductById = jest.fn();
  const mockGetAllCategories = jest.fn();
  const mockUpdateProduct = jest.fn();
  const mockDeleteProduct = jest.fn();


  const productService = ProductService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      mockGetAllProducts.mockResolvedValueOnce([mockProduct]);

      (PrismaProductRepository.prototype.getAllProducts as jest.Mock).mockImplementationOnce(mockGetAllProducts);

      const result = await productService.getAllProducts(1, 10);

      expect(result).toEqual([mockProduct]);
      expect(mockGetAllProducts).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      mockGetProductById.mockResolvedValueOnce(mockProduct);

      (PrismaProductRepository.prototype.getProductById as jest.Mock).mockImplementationOnce(mockGetProductById);

      const result = await productService.getProductById(1);

      expect(result).toEqual(mockProduct);
      expect(mockGetProductById).toHaveBeenCalledWith(1);
    });
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {

      const mockCategories = ['Category1', 'Category2'];
      mockGetAllCategories.mockResolvedValueOnce(mockCategories);

      (PrismaProductRepository.prototype.getAllCategories as jest.Mock).mockImplementationOnce(mockGetAllCategories);

      const result = await productService.getAllCategories();

      expect(result).toEqual(mockCategories);
      expect(mockGetAllCategories).toHaveBeenCalled();
    });
  });

  describe('updateProduct', () => {
  it('should update a product successfully', async () => {

    mockUpdateProduct.mockResolvedValueOnce(mockProduct);

    (PrismaProductRepository.prototype.updateProduct as jest.Mock).mockImplementationOnce(mockUpdateProduct);

    const updatedProductData: Partial<Product> = { price: 20 }; // Update the price instead of name
    const result = await productService.updateProduct(1, updatedProductData);

    expect(result).toEqual(mockProduct);
    expect(mockUpdateProduct).toHaveBeenCalledWith(1, updatedProductData);
  });
});


  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {

      mockDeleteProduct.mockResolvedValueOnce(true);

      (PrismaProductRepository.prototype.deleteProduct as jest.Mock).mockImplementationOnce(mockDeleteProduct);

      const result = await productService.deleteProduct(1);

      expect(result).toBeTruthy();
      expect(mockDeleteProduct).toHaveBeenCalledWith(1);
    });
  });
});
