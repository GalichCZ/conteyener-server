import { KmToDistBody } from './types/km-to-dist-body';
import FollowingRepository from '../db/repositories/following.repository';
import KmToDistCalculateRepository from '../db/repositories/kmToDistCalculate.repository';
import CalculatedDateRepository from '../db/repositories/calculatedDate.repository';
import GError from '../error-handler/GError';
import { DeliveryMethods } from './enums/delivery-methods';
import dayjs from 'dayjs';

class KmToDistService {
  private _kmToDistRepository = new KmToDistCalculateRepository();
  private _calculateDateRepository = new CalculatedDateRepository();
  private _followingRepository = new FollowingRepository();
  private formulaConstant = 700;

  async updateKmToDist(body: KmToDistBody) {
    const transaction = await this._kmToDistRepository.startTransaction();
    try {
      const following = await this._followingRepository.findById(
        body.following_id
      );

      if (!following) {
        throw new GError({
          message: `Following with id ${body.following_id} not found`,
          status: 404,
          methodName: this.updateKmToDist.name,
          serviceName: KmToDistService.name,
        });
      }

      if (!following.km_to_dist_calculate) {
        await this._kmToDistRepository.create({
          following_id: following.id,
          km_to_dist: body.km,
          km_was_updated: true,
        });
      }

      const isSeaMethod =
        following.delivery_method.method === DeliveryMethods.sea;

      if (!isSeaMethod) {
        await this._kmToDistRepository.updateByFollowingId(following.id, {
          km_to_dist: body.km,
          km_was_updated: true,
        });
        await transaction.commit();
        return;
      }

      const today = new Date(new Date().setHours(12, 0, 0, 0));

      const daysToAdd = Math.ceil(body.km / this.formulaConstant);

      const newDate = () => {
        const trainArriveDate = following.calculated_dates.train_arrive_date;
        if (!trainArriveDate) return null;

        return !following.km_to_dist_calculate.km_was_updated
          ? this.addDayToDate(new Date(trainArriveDate), daysToAdd)
          : this.addDayToDate(new Date(today), daysToAdd);
      };

      await this._kmToDistRepository.updateByFollowingId(following.id, {
        km_to_dist: body.km,
        km_was_updated: true,
      });
      await this._calculateDateRepository.update(
        following.calculated_dates.id,
        {
          train_arrive_date: newDate(),
        }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private addDayToDate(toUpdate: Date, days: number) {
    return dayjs(toUpdate).add(days, 'day').toDate();
  }
}

export default KmToDistService;
