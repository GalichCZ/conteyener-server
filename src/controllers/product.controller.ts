import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import SimpleProductRepository from '../db/repositories/simpleProduct.repository';

class ProductController {
  private _productRepository = new SimpleProductRepository();

  createProduct = async (req: Request, res: Response) => {
    try {
      const product = await this._productRepository.create(req.body);
      res.status(StatusCodes.CREATED).json(product);
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  };

  getProduct = async (req: Request, res: Response) => {
    try {
      const products = await this._productRepository.findAll();
      res.status(StatusCodes.OK).json(products);
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    try {
      const deletedCount = await this._productRepository.delete(req.params.id);
      if (!deletedCount) {
        res.status(StatusCodes.NOT_FOUND).send({ error: 'Not found' });
        return;
      }
      res.status(StatusCodes.OK).send('OK');
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    try {
      const product = await this._productRepository.update(
        req.params.id,
        req.body
      );
      if (!product) {
        res.status(StatusCodes.NOT_FOUND).send({ error: 'Not found' });
        return;
      }
      res.status(StatusCodes.OK).json(product);
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  };
}

export default ProductController;
