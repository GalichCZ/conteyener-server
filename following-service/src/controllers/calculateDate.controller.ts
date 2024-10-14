import CalculateDateService from '../services/calculate-date.service';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

class CalculateDateController {
  private _calculateDateService = new CalculateDateService();

  getCalculatedDate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const calculatedDate = await this._calculateDateService.getCalculatedDate(
        req.params.following_id
      );
      res.status(StatusCodes.OK).json(calculatedDate);
    } catch (error) {
      next(error);
    }
  };

  calculateDate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const calculatedDate =
        await this._calculateDateService.createCalculatedDate(req.body);
      res.status(StatusCodes.CREATED).json(calculatedDate);
    } catch (error) {
      next(error);
    }
  };

  recalculateDate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const calculatedDate = await this._calculateDateService.recalculateDate(
        req.body
      );
      res.status(StatusCodes.OK).json(calculatedDate);
    } catch (error) {
      next(error);
    }
  };
}

export default CalculateDateController;
