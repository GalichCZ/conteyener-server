import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import ContainerTypeRepository from '../db/repositories/containerType.repository';

class ContainerTypeController {
  private _containerTypeRepository = new ContainerTypeRepository();

  createContainerType = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const containerType = await this._containerTypeRepository.create(
        req.body
      );
      res.status(StatusCodes.CREATED).json(containerType);
    } catch (error) {
      next(error);
    }
  };

  getContainerTypes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const containerTypes = await this._containerTypeRepository.findAll();
      res.status(StatusCodes.OK).json(containerTypes);
    } catch (error) {
      next(error);
    }
  };
}

export default ContainerTypeController;
