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
import { onSave } from './elastic-crud/on-save';

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

      let deliveryMethod = null;
      if (input.delivery_method) {
        deliveryMethod = await getEntity<DeliveryMethodOutput>(
          input.delivery_method,
          'Delivery method',
          this._deliveryMethodRepository,
          this.updateFollowing.name,
          FollowingUpdateService.name,
          transaction
        );
        updateObject.delivery_method_id = deliveryMethod.id;
      }

      let store = null;
      if (input.store) {
        store = await getEntity<StoreOutput>(
          input.store,
          'Store',
          this._storeRepository,
          this.updateFollowing.name,
          FollowingUpdateService.name,
          transaction
        );
        updateObject.store_id = store.id;
      }

      let containerType = null;
      if (input.container_type) {
        containerType = await getEntity<ContainerTypeOutput>(
          input.container_type,
          'Container type',
          this._containerTypeRepository,
          this.updateFollowing.name,
          FollowingUpdateService.name,
          transaction
        );

        updateObject.container_type_id = containerType.id;
      }

      let stockPlace = null;
      if (input.stock_place) {
        stockPlace = await getEntity<StockPlaceOutput>(
          input.stock_place,
          'Stock place',
          this._stockPlaceRepository,
          this.updateFollowing.name,
          FollowingUpdateService.name,
          transaction
        );
        updateObject.stock_place_id = stockPlace.id;
      }

      let deliveryChannel = null;
      if (input.delivery_channel) {
        deliveryChannel = await getEntity<DeliveryChannelOutput>(
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

      let orderNumbers = null;
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
        const updatedOrderNumbers =
          await this._orderNumberRepository.updateManyByOrderNumberIds(
            inputNumbersWithId,
            transaction
          );

        orderNumbers = [...createdOrderNumbers, ...updatedOrderNumbers];
      }

      let simpleProducts = null;
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
        const createdProducts =
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
        const updatedProducts =
          await this._simpleProductRepository.updateManyByProductIds(
            productsWithId,
            transaction
          );

        simpleProducts = [...createdProducts, ...updatedProducts];
      }

      const declarationNumbers = [];
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
            const newDeclaration = await this._declarationRepository.create(
              { number: declaration.number, following_id: following.id },
              transaction
            );
            declarationNumbers.push(newDeclaration);
          }
        }
        const declarationNumbersToUpdate = input.declaration_number.filter(
          (d) => d.id
        );
        if (declarationNumbersToUpdate.length) {
          for (const declarationToUpdate of declarationNumbersToUpdate) {
            const updatedDeclaration = await this._declarationRepository.update(
              declarationToUpdate.id!,
              {
                number: declarationToUpdate.number,
              }
            );
            declarationNumbers.push(updatedDeclaration);
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

      const updatedFollowing = await this._followingRepository.update(
        following.id,
        updateObject as Partial<FollowingType>
      );

      await onSave({
        following: updatedFollowing,
        order_numbers: orderNumbers,
        transaction,
        deliveryMethod,
        store,
        containerType,
        stockPlace,
        simpleProducts,
        declarationNumberModels: declarationNumbers,
      });
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
