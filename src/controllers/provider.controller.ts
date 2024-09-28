import ProviderRepository from '../db/repositories/provider.repository';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class ProviderController {
  private _providerRepository = new ProviderRepository();

  getProviders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const providers = await this._providerRepository.findAll();
      res.status(StatusCodes.OK).json(providers);
    } catch (error) {
      next(error);
    }
  };

  createProvider = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const provider = await this._providerRepository.create(req.body);
      res.status(StatusCodes.CREATED).json(provider);
    } catch (error) {
      next(error);
    }
  };

  updateProvider = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const provider = await this._providerRepository.update(
        req.params.id,
        req.body
      );
      res.status(StatusCodes.OK).json(provider);
    } catch (error) {
      next(error);
    }
  };

  deleteProvider = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deletedCount = await this._providerRepository.delete(req.params.id);
      if (!deletedCount) {
        res.status(StatusCodes.NOT_FOUND).send({ error: 'Not found' });
        return;
      }
      res.status(StatusCodes.OK).send('OK');
    } catch (error) {
      next(error);
    }
  };
}

export default ProviderController;
