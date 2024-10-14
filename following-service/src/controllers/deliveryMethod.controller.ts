import { Request, Response, NextFunction } from 'express';
import DeliveryMethodRepository from '../db/repositories/deliveryMethod.repository';
import { StatusCodes } from 'http-status-codes';

class DeliveryMethodController {
  private _deliveryMethodRepository = new DeliveryMethodRepository();

  createDeliveryMethod = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const deliveryMethod = await this._deliveryMethodRepository.create(
        req.body
      );
      res.status(StatusCodes.CREATED).json(deliveryMethod);
    } catch (error) {
      next(error);
    }
  };

  getDeliveryMethods = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const deliveryMethods = await this._deliveryMethodRepository.findAll();
      res.status(StatusCodes.OK).json(deliveryMethods);
    } catch (error) {
      next(error);
    }
  };

  deleteDeliveryMethod = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const deletedCount = await this._deliveryMethodRepository.delete(
        req.params.id
      );
      if (!deletedCount) {
        res.status(StatusCodes.NOT_FOUND).send({ error: 'Not found' });
        return;
      }
      res.status(StatusCodes.OK).send('OK');
    } catch (error) {
      next(error);
    }
  };

  updateDeliveryMethod = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const deliveryMethod = await this._deliveryMethodRepository.update(
        req.params.id,
        req.body
      );
      res.status(StatusCodes.OK).json(deliveryMethod);
    } catch (error) {
      next(error);
    }
  };
}

export default DeliveryMethodController;
