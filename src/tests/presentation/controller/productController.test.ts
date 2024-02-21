import { Request, Response } from 'express';
import ProductController from '../../../presentation/controllers/productController';
import ProductService from '../../../application/productServices';

jest.mock('../../../application/productServices');

describe('ProductController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return all products with pagination', async () => {
    const mockPage = '1';
    const mockLimit = '8';
    const mockProducts = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];

    req.query = { page: mockPage, limit: mockLimit };

    (ProductService.getAllProducts as jest.Mock).mockResolvedValueOnce(mockProducts);

    await ProductController.getAllProducts(req as Request, res as Response);

    expect(ProductService.getAllProducts).toHaveBeenCalledWith(expect.any(Number), expect.any(Number));
    expect(ProductService.getAllProducts).toHaveBeenCalledWith(Number(mockPage), Number(mockLimit));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockProducts);
  });

  it('should handle errors', async () => {
    const errorMessage = 'Internal Server Error';

    req.query = { page: '1', limit: '8' }; // Ensure page and limit are strings

    (ProductService.getAllProducts as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await ProductController.getAllProducts(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });
  });

  describe('getProductById', () => {
    it('should return product by ID', async () => {
      const mockProduct = { id: 1, name: 'Product 1' };
      req.params = { id: '1' };
      (ProductService.getProductById as jest.Mock).mockResolvedValueOnce(mockProduct);

      await ProductController.getProductById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it('should handle invalid product ID', async () => {
      req.params = { id: 'invalid' };

      await ProductController.getProductById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid product ID' });
    });

    it('should handle product not found', async () => {
      req.params = { id: '999' };
      (ProductService.getProductById as jest.Mock).mockResolvedValueOnce(null);

      await ProductController.getProductById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    it('should handle errors', async () => {
      const errorMessage = 'Internal Server Error';
      req.params = { id: '1' };
      (ProductService.getProductById as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await ProductController.getProductById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

   describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const mockCategories = ['Electronics', 'Clothing'];
      (ProductService.getAllCategories as jest.Mock).mockResolvedValueOnce(mockCategories);

      await ProductController.getAllCategories(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCategories);
    });

    it('should handle errors', async () => {
      const errorMessage = 'Internal Server Error';
      (ProductService.getAllCategories as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await ProductController.getAllCategories(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('updateProduct', () => {
    it('should update product', async () => {
      const productId = 1;
      const updatedProduct = { id: productId, name: 'Updated Product' };
      req.params = { productId: productId.toString() };
      req.body = updatedProduct;
      (ProductService.updateProduct as jest.Mock).mockResolvedValueOnce(updatedProduct);

      await ProductController.updateProduct(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedProduct);
    });

    it('should handle product not found', async () => {
      const productId = 999;
      req.params = { productId: productId.toString() };
      (ProductService.updateProduct as jest.Mock).mockResolvedValueOnce(null);

      await ProductController.updateProduct(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    it('should handle errors', async () => {
      const errorMessage = 'Internal Server Error';
      const productId = 1;
      req.params = { productId: productId.toString() };
      req.body = { name: 'Updated Product' };
      (ProductService.updateProduct as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await ProductController.updateProduct(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('deleteProduct', () => {
    it('should delete product', async () => {
      const productId = 1;
      const deletedProduct = { id: productId, name: 'Deleted Product' };
      req.params = { productId: productId.toString() };
      (ProductService.deleteProduct as jest.Mock).mockResolvedValueOnce(deletedProduct);

      await ProductController.deleteProduct(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(deletedProduct);
    });

    it('should handle product not found', async () => {
      const productId = 999;
      req.params = { productId: productId.toString() };
      (ProductService.deleteProduct as jest.Mock).mockResolvedValueOnce(null);

      await ProductController.deleteProduct(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    it('should handle errors', async () => {
      const errorMessage = 'Internal Server Error';
      const productId = 1;
      req.params = { productId: productId.toString() };
      (ProductService.deleteProduct as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await ProductController.deleteProduct(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
