import { IBaseRepository } from './base-repository.interface';
import {
  FollowingDeliveryChannelInput,
  FollowingDeliveryChannelOutput,
} from '../../models/FollowingDeliveryChannel.model';

export interface IFollowingDeliveryChannelRepository
  extends IBaseRepository<
    FollowingDeliveryChannelInput,
    FollowingDeliveryChannelOutput
  > {}
