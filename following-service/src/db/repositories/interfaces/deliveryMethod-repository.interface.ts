import { IBaseRepository } from './base-repository.interface';
import {
  DeliveryMethodInput,
  DeliveryMethodOutput,
} from '../../models/DeliveryMethod.model';

export interface IDeliveryMethodRepository
  extends IBaseRepository<DeliveryMethodInput, DeliveryMethodOutput> {}
