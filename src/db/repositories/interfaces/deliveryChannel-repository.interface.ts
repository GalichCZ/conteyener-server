import {
  DeliveryChannelInput,
  DeliveryChannelOutput,
} from '../../models/DeliveryChannel.model';
import { IBaseRepository } from './base-repository.interface';

export interface IDeliveryChannelRepository
  extends IBaseRepository<DeliveryChannelInput, DeliveryChannelOutput> {}
