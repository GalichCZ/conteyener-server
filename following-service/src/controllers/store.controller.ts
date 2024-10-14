import { Request, Response } from 'express';
import StoreRepository from '../db/repositories/store.repository';
import { StatusCodes } from 'http-status-codes';

class StoreController {
  private _storeRepository = new StoreRepository();

  createStore = async (req: Request, res: Response) => {
    try {
      const store = await this._storeRepository.create(req.body);
      res.status(StatusCodes.CREATED).json(store);
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  };

  getStores = async (req: Request, res: Response) => {
    try {
      const stores = await this._storeRepository.findAll();
      res.status(StatusCodes.OK).json(stores);
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  };

  deleteStore = async (req: Request, res: Response) => {
    try {
      const deletedCount = await this._storeRepository.delete(req.params.id);
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

  updateStore = async (req: Request, res: Response) => {
    try {
      const store = await this._storeRepository.update(req.params.id, req.body);
      if (!store) {
        res.status(StatusCodes.NOT_FOUND).send({ error: 'Not found' });
        return;
      }
      res.status(StatusCodes.OK).json(store);
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  };
}

export default StoreController;
