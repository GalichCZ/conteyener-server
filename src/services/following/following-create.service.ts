import FollowingService from './following.service';
import { IFollowingCreate } from '../types/FollowingBody';
import { DeliveryMethodOutput } from '../../db/models/DeliveryMethod.model';
import { StoreOutput } from '../../db/models/Store.model';
import { ContainerTypeOutput } from '../../db/models/ContainerType.model';
import { FollowingInput } from '../../db/models/Following.model';
import { getEntity } from '../../utils';

class FollowingCreateService extends FollowingService {
  constructor() {
    super();
  }

  async createFollowing(followingBody: IFollowingCreate) {
    const transaction = await this._followingRepository.startTransaction();

    try {
      const {
        order_numbers,
        delivery_method,
        store: store_id,
        container_type,
        request_date,
        importers,
        conditions,
        agent,
        direction,
        place_of_dispatch,
        providers,
      } = followingBody;

      const order_number = order_numbers!.map((o) => o.number);

      await this.checkExistingOrderNumbers(
        order_number,
        this.createFollowing.name,
        transaction
      );

      const [deliveryMethod, store, containerType] = await Promise.all([
        getEntity<DeliveryMethodOutput>(
          delivery_method,
          'Delivery method',
          this._deliveryMethodRepository,
          this.createFollowing.name,
          FollowingCreateService.name,
          transaction
        ),
        getEntity<StoreOutput>(
          store_id,
          'Store',
          this._storeRepository,
          this.createFollowing.name,
          FollowingCreateService.name,
          transaction
        ),
        getEntity<ContainerTypeOutput>(
          container_type,
          'Container type',
          this._containerTypeRepository,
          this.createFollowing.name,
          FollowingCreateService.name,
          transaction
        ),
      ]);

      const followingInput: FollowingInput = {
        request_date,
        importers,
        conditions,
        agent,
        direction,
        store_id: store.id,
        delivery_method_id: deliveryMethod.id,
        container_type_id: containerType.id,
        place_of_dispatch,
        hidden: false,
      };

      const following = await this._followingRepository.create(
        followingInput,
        transaction
      );

      const orderNumbers = await this._orderNumberRepository.createOrderNumbers(
        order_number,
        following.id,
        transaction
      );

      await this._isDocsRepository.createIsDocs(
        orderNumbers.map((oN) => oN.id),
        transaction
      );

      await this._followingProviderRepository.createMany(
        providers,
        following.id,
        transaction
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default FollowingCreateService;
