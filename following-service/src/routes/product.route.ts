import { Router } from 'express';
import { validateBody } from '../middleware/bodyValidation.middleware';
import { ProductSchema } from '../schema/product.schema';
import ProductController from '../controllers/product.controller';

const router = Router();
const _productController = new ProductController();

router.post(
  '/product',
  validateBody(ProductSchema),
  _productController.createProduct
);
router.get('/product', _productController.getProduct);
router.delete('/product/:id', _productController.deleteProduct);
router.put(
  '/product/:id',
  validateBody(ProductSchema),
  _productController.updateProduct
);

export default router;
