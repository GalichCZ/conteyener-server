import { Request, Response, NextFunction } from 'express';
import KmToDistService from '../services/km-to-dist.service';
import { StatusCodes } from 'http-status-codes';

class KmToDistController {
  private _kmToDistService = new KmToDistService();

  updateKmToDist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const kmToDist = await this._kmToDistService.updateKmToDist(req.body);
      res.status(StatusCodes.OK).json(kmToDist);
    } catch (error) {
      next(error);
    }
  };
}

export default KmToDistController;
