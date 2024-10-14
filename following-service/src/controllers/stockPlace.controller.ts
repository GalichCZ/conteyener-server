import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import StockPlaceRepository from '../db/repositories/stockPlace.repository';

class StockPlaceController {
  private _stockPlaceRepository = new StockPlaceRepository();

  createStockPlace = async (req: Request, res: Response) => {
    try {
      const stockPlace = await this._stockPlaceRepository.create(req.body);
      res.status(StatusCodes.CREATED).json(stockPlace);
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  };

  getStockPlaces = async (req: Request, res: Response) => {
    try {
      const stockPlaces = await this._stockPlaceRepository.findAll();
      res.status(StatusCodes.OK).json(stockPlaces);
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  };

  deleteStockPlace = async (req: Request, res: Response) => {
    try {
      const deletedCount = await this._stockPlaceRepository.delete(
        req.params.id
      );
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

  updateStockPlace = async (req: Request, res: Response) => {
    try {
      const stockPlace = await this._stockPlaceRepository.update(
        req.params.id,
        req.body
      );
      if (!stockPlace) {
        res.status(StatusCodes.NOT_FOUND).send({ error: 'Not found' });
        return;
      }
      res.status(StatusCodes.OK).json(stockPlace);
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  };
}

export default StockPlaceController;
