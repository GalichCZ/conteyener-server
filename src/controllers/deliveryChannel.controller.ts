import DeliveryChannelRepository from '../db/repositories/deliveryChannel.repository';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

class DeliveryChannelController {
  private _deliveryChannelRepository = new DeliveryChannelRepository();

  createDeliveryChannel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const deliveryChannel = await this._deliveryChannelRepository.create(
        req.body
      );
      res.status(StatusCodes.CREATED).json(deliveryChannel);
    } catch (error) {
      next(error);
    }
  };

  getDeliveryChannels = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const deliveryChannels = await this._deliveryChannelRepository.findAll();
      res.status(StatusCodes.OK).json(deliveryChannels);
    } catch (error) {
      next(error);
    }
  };

  deleteDeliveryChannel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const deletedCount = await this._deliveryChannelRepository.delete(
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

  updateDeliveryChannel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const deliveryChannel = await this._deliveryChannelRepository.update(
        req.params.id,
        req.body
      );
      if (!deliveryChannel) {
        res.status(StatusCodes.NOT_FOUND).send({ error: 'Not found' });
        return;
      }
      res.status(StatusCodes.OK).json(deliveryChannel);
    } catch (error) {
      next(error);
    }
  };
}

export default DeliveryChannelController;
