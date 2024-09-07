import { IBaseRepository } from './base-repository.interface';
import {
  StockPlaceInput,
  StockPlaceOutput,
} from '../../models/StockPlace.model';

export interface IStockPlaceRepository
  extends IBaseRepository<StockPlaceInput, StockPlaceOutput> {}
