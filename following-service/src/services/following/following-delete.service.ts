import FollowingService from './following.service';
import { FollowingOutput } from '../../db/models/Following.model';
import { getEntity } from '../../utils';

class FollowingDeleteService extends FollowingService {
  constructor() {
    super();
  }

  async deleteFollowing(id: string) {
    const transaction = await this._followingRepository.startTransaction();
    let transactionStarted = false;

    try {
      transactionStarted = true;

      await getEntity<FollowingOutput>(
        id,
        'Following',
        this._followingRepository,
        this.deleteFollowing.name,
        FollowingDeleteService.name,
        transaction
      );

      const simpleProducts =
        await this._simpleProductRepository.getProductsByFollowingId(
          id,
          transaction
        );

      await Promise.all([
        this._followingProviderRepository.deleteByFollowingId(id, transaction),
        this._kmToDistCalculateRepository.deleteByFollowingId(id, transaction),
        this._productSpecificationRepository.deleteBySimpleProductIds(
          simpleProducts.map((p) => p.id),
          transaction
        ),
        this._simpleProductRepository.deleteByFollowingId(id, transaction),
        this._calculatedDateRepository.deleteByFollowingId(id, transaction),
      ]);

      const orderNumbers =
        await this._orderNumberRepository.findAllByFollowingId(id, transaction);
      await this._isDocsRepository.deleteByOrderNumberIds(
        orderNumbers.map((o) => o.id),
        transaction
      );
      await this._orderNumberRepository.deleteByFollowingId(id, transaction);

      const declarations =
        await this._declarationRepository.findAllByFollowingId(id, transaction);
      await this._declarationStatusRepository.deleteByDeclarationIds(
        declarations.map((d) => d.id),
        transaction
      );
      await this._declarationRepository.deleteByFollowingId(id, transaction);

      await this._followingRepository.delete(id, transaction);

      await transaction.commit();
    } catch (error) {
      if (transactionStarted) {
        await transaction.rollback();
      }
      throw error;
    }
  }
}

export default FollowingDeleteService;
