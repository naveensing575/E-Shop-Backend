import { Request, Response } from 'express';
import ProductService from '../services/productServices';

class ProductController {
  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await ProductService.getAllProducts();
      return res.status(200).json(products);
    } catch (error) {
      console.error('Error retrieving products:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

 async getProductById(req: Request, res: Response) {
  const productId = parseInt(req.params.id, 10);

  if (isNaN(productId) || productId <= 0) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    const product = await ProductService.getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error('Error retrieving product by ID:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

  async updateProduct(req: Request, res: Response) {
    try {
      const productId = parseInt(req.params.productId, 10);

      const updatedProduct = await ProductService.updateProduct(productId, req.body);

      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const productId = parseInt(req.params.productId, 10);

      const deletedProduct = await ProductService.deleteProduct(productId);

      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.status(200).json(deletedProduct);
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new ProductController();
