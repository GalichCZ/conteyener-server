import { IFollowingUpdate } from '../types/FollowingBody';
import { FollowingOutput } from '../../db/models/Following.model';
import { FollowingType } from '../../db/models/interfaces';
import { DeliveryMethodOutput } from '../../db/models/DeliveryMethod.model';
import { StoreOutput } from '../../db/models/Store.model';
import { ContainerTypeOutput } from '../../db/models/ContainerType.model';
import { StockPlaceOutput } from '../../db/models/StockPlace.model';
import { DeliveryChannelOutput } from '../../db/models/DeliveryChannel.model';
import GError from '../../error-handler/GError';
import { getMissingStringsFromInput } from '../../utils';
import { getEntity } from '../../utils';
import FollowingService from './following.service';

class FollowingUpdateService extends FollowingService {
  constructor() {
    super();
  }
  async updateFollowing(id: string, input: Partial<IFollowingUpdate>) {
    const transaction = await this._followingRepository.startTransaction();
    let transactionStarted = false;
    try {
      transactionStarted = true;
      const following = await getEntity<FollowingOutput>(
        id,
        'Following',
        this._followingRepository,
        this.updateFollowing.name,
        FollowingUpdateService.name,
        transaction
      );

      const updateObject: Partial<FollowingType> = {
        ...(input as FollowingType),
      };

      if (input.delivery_method) {
        const deliveryMethod = await getEntity<DeliveryMethodOutput>(
          input.delivery_method,
          'Delivery method',
          this._deliveryMethodRepository,
          this.updateFollowing.name,
          FollowingUpdateService.name,
          transaction
        );
        updateObject.delivery_method_id = deliveryMethod.id;
      }

      if (input.store) {
        const store = await getEntity<StoreOutput>(
          input.store,
          'Store',
          this._storeRepository,
          this.updateFollowing.name,
          FollowingUpdateService.name,
          transaction
        );
        updateObject.store_id = store.id;
      }

      if (input.container_type) {
        const containerType = await getEntity<ContainerTypeOutput>(
          input.container_type,
          'Container type',
          this._containerTypeRepository,
          this.updateFollowing.name,
          FollowingUpdateService.name,
          transaction
        );

        updateObject.container_type_id = containerType.id;
      }

      if (input.stock_place) {
        const stockPlace = await getEntity<StockPlaceOutput>(
          input.stock_place,
          'Stock place',
          this._stockPlaceRepository,
          this.updateFollowing.name,
          FollowingUpdateService.name,
          transaction
        );
        updateObject.stock_place_id = stockPlace.id;
      }

      if (input.delivery_channel) {
        const deliveryChannel = await getEntity<DeliveryChannelOutput>(
          input.delivery_channel,
          'Delivery channel',
          this._deliveryChannelRepository,
          this.updateFollowing.name,
          FollowingUpdateService.name,
          transaction
        );
        updateObject.delivery_channel_id = deliveryChannel.id;
      }

      if (input.container_number) {
        const following = await this._followingRepository.findByContainerNumber(
          input.container_number,
          transaction
        );
        if (following && following.id !== id) {
          throw new GError({
            message: 'Following with this container number already exists',
            status: 400,
            methodName: this.updateFollowing.name,
            serviceName: FollowingUpdateService.name,
          });
        } else {
          updateObject.container_number = input.container_number;
        }
      }

      if (input.order_numbers) {
        //REMARK! I need to compare ids of numbers, not numbers themselves
        const inputNumbersWithId = input.order_numbers.filter(
          (n) => n.id !== null
        );
        const orderNumbersFromDb =
          await this._orderNumberRepository.findAllByFollowingId(
            id,
            transaction
          );

        //check if order numbers without id are not in DB already,
        // if not - create them and create also create docs for them
        const numbersWithoutIds = input.order_numbers
          .filter((n) => !n.id)
          .map((n) => n.number);
        await this.checkExistingOrderNumbers(
          numbersWithoutIds,
          this.updateFollowing.name,
          transaction
        );
        const createdOrderNumbers =
          await this._orderNumberRepository.createOrderNumbers(
            numbersWithoutIds,
            id,
            transaction
          );
        await this._isDocsRepository.createIsDocs(
          createdOrderNumbers.map((n) => n.id),
          transaction
        );

        //delete missing order numbers and delete docs for them
        const missingIds = getMissingStringsFromInput(
          inputNumbersWithId.map((n) => n.id),
          orderNumbersFromDb.map((n) => n.id)
        );
        await this._isDocsRepository.deleteByOrderNumberIds(
          missingIds,
          transaction
        );
        await this._orderNumberRepository.deleteMissingOrderNumbers(
          missingIds,
          transaction
        );

        //update order numbers with id
        await this._orderNumberRepository.updateManyByOrderNumberIds(
          inputNumbersWithId,
          transaction
        );
      }

      if (input.products) {
        //split products into simple_product and product_specifications done
        // each simple product may have multiple specification records

        const productsWithId = input.products.filter((p) => p.id !== null);

        const productsFromDb =
          await this._simpleProductRepository.getProductsByFollowingId(
            id,
            transaction
          );

        const productsWithoutIds = input.products
          .filter((p) => !p.id)
          .map((p) => p.name);
        //create new products(without ids)
        await this._simpleProductRepository.createSimpleProducts(
          productsWithoutIds,
          id,
          transaction
        );

        //delete missing products
        //  delete specifications for missing products
        const inputIds = productsWithId
          .map((p) => p.id)
          .filter((id): id is string => id !== null);
        const missingProductIds = getMissingStringsFromInput(
          inputIds,
          productsFromDb.map((p) => p.id)
        );
        await this._simpleProductRepository.deleteMissingProducts(
          missingProductIds,
          transaction
        );
        await this._productSpecificationRepository.deleteBySimpleProductIds(
          missingProductIds,
          transaction
        );

        //update existing products(with ids)
        await this._simpleProductRepository.updateManyByProductIds(
          productsWithId,
          transaction
        );
      }

      if (input.declaration_number) {
        //some bugs with deleting declarations
        const declarationIds = input.declaration_number
          .map((d) => d.id)
          .filter((d): d is string => d !== null);

        await this._declarationRepository.deleteMissingDeclarations(
          declarationIds,
          following.id,
          transaction
        );
        const newDeclarationNumbers = input.declaration_number.filter(
          (d) => !d.id
        );
        if (newDeclarationNumbers.length) {
          for (const declaration of newDeclarationNumbers) {
            await this._declarationRepository.create(
              { number: declaration.number, following_id: following.id },
              transaction
            );
          }
        }
        const declarationNumbersToUpdate = input.declaration_number.filter(
          (d) => d.id
        );
        if (declarationNumbersToUpdate.length) {
          for (const declarationToUpdate of declarationNumbersToUpdate) {
            await this._declarationRepository.update(declarationToUpdate.id!, {
              number: declarationToUpdate.number,
            });
          }
        }
      }

      if (input.providers) {
        //delete or create many-to-many relations
        await this._followingProviderRepository.deleteMissingProvidersRelations(
          input.providers,
          id,
          transaction
        );

        await this._followingProviderRepository.createMany(
          input.providers,
          id,
          transaction
        );
      }

      await this._followingRepository.update(
        following.id,
        updateObject as Partial<FollowingType>
      );
      // await this._followingRepository.update(following.id, input, transaction);
      await transaction.commit();
    } catch (error) {
      if (transactionStarted) {
        await transaction.rollback();
      }
      throw error;
    }
  }
}

export default FollowingUpdateService;
