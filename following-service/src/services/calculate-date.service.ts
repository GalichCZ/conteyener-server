import CalculatedDateRepository from '../db/repositories/calculatedDate.repository';
import DeliveryChannelRepository from '../db/repositories/deliveryChannel.repository';
import {
  CalculateDateBody,
  DateType,
  DateTypeKey,
} from './types/calculate-date-body';
import { getEntity } from '../utils';
import { DeliveryChannelOutput } from '../db/models/DeliveryChannel.model';
import dayjs from 'dayjs';
import GError from '../error-handler/GError';
import { CalculatedDateInput } from '../db/models/CalculatedDate.model';

class CalculateDateService {
  private _calculatedDateRepository = new CalculatedDateRepository();
  private _deliveryChannelRepository = new DeliveryChannelRepository();
  private dateTypes = Object.values(DateType);

  async getCalculatedDate(followingId: string) {
    const record =
      await this._calculatedDateRepository.findByFollowingId(followingId);
    if (!record) {
      throw new GError({
        message: `Could not find calculated date for following id ${followingId}`,
        status: 404,
        methodName: this.getCalculatedDate.name,
        serviceName: CalculateDateService.name,
      });
    }
    return record;
  }

  async createCalculatedDate(body: CalculateDateBody) {
    const transaction = await this._calculatedDateRepository.startTransaction();
    let transactionStarted = false;
    try {
      transactionStarted = true;
      const { delivery_channel_id, following_id, date: dateString } = body;
      const date = new Date(dateString);
      const deliveryChannel = await getEntity<DeliveryChannelOutput>(
        delivery_channel_id,
        'DeliveryChannel',
        this._deliveryChannelRepository,
        this.createCalculatedDate.name,
        CalculateDateService.name,
        transaction
      );

      //create a function that will check if days number exists and if not set null date
      let lastNotNullDate = new Date(date);
      const eta = this.calculateDate(
        date,
        deliveryChannel.eta,
        lastNotNullDate
      );
      const date_do = this.calculateDate(
        eta,
        deliveryChannel.date_do,
        lastNotNullDate
      );
      const declaration_issue_date = this.calculateDate(
        date_do,
        deliveryChannel.declaration_issue_date,
        lastNotNullDate
      );
      const train_depart_date = this.calculateDate(
        declaration_issue_date,
        deliveryChannel.train_depart_date,
        lastNotNullDate
      );
      const train_arrive_date = this.calculateDate(
        train_depart_date,
        deliveryChannel.train_arrive_date,
        lastNotNullDate
      );
      const store_arrive_date = this.calculateDate(
        train_arrive_date,
        deliveryChannel.store_arrive_date,
        lastNotNullDate
      );

      const calculatedDate = await this._calculatedDateRepository.create({
        following_id,
        etd: date,
        eta,
        eta_update: false,
        date_do,
        date_do_update: false,
        declaration_issue_date,
        declaration_issue_date_update: false,
        store_arrive_date,
        store_arrive_date_update: false,
        train_arrive_date,
        train_arrive_date_update: false,
        train_depart_date,
        train_depart_date_update: false,
      });

      await transaction.commit();

      return calculatedDate;
    } catch (error) {
      if (transactionStarted) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  async recalculateDate(body: CalculateDateBody) {
    const transaction = await this._calculatedDateRepository.startTransaction();
    let transactionStarted = false;
    try {
      transactionStarted = true;
      const {
        delivery_channel_id,
        following_id,
        date: dateString,
        date_type,
      } = body;

      const date = new Date(dateString);
      const deliveryChannel = await getEntity<DeliveryChannelOutput>(
        delivery_channel_id,
        'DeliveryChannel',
        this._deliveryChannelRepository,
        this.recalculateDate.name,
        CalculateDateService.name,
        transaction
      );
      const calculatedDate =
        await this._calculatedDateRepository.findByFollowingId(
          following_id,
          transaction
        );
      if (!calculatedDate)
        throw new GError({
          message: `Could not find calculated date for following id ${following_id}`,
          status: 404,
          methodName: this.recalculateDate.name,
          serviceName: CalculateDateService.name,
        });

      const datesToUpdate = this.getDatesToUpdate(date_type as DateTypeKey);

      const updateObject = {
        [date_type]: new Date(date),
        [`${date_type as string}_update`]: true,
      } as Partial<CalculatedDateInput>;

      let lastNotNullDate = new Date(date);
      let previousDate: Date | null = new Date(date);
      for (const dateType of datesToUpdate) {
        const daysToAdd =
          deliveryChannel[`${dateType as keyof typeof DateType}`];
        previousDate = this.calculateDate(
          previousDate,
          daysToAdd,
          lastNotNullDate
        );
        updateObject[`${dateType}`] = previousDate;
      }

      await this._calculatedDateRepository.update(
        calculatedDate.id,
        updateObject,
        transaction
      );
    } catch (error) {
      if (transactionStarted) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  private getDatesToUpdate(start: DateTypeKey) {
    //@ts-ignore
    const startIndex = this.dateTypes.indexOf(start);
    return this.dateTypes.slice(startIndex + 1);
  }

  private calculateDate(
    date: Date | null,
    daysToAdd: number,
    lastNotNullDate: Date
  ) {
    if (date) lastNotNullDate.setTime(date.getTime());
    if (typeof daysToAdd === 'string' && parseInt(daysToAdd, 10) === 0)
      return null;
    if (!date) return dayjs(lastNotNullDate).add(daysToAdd, 'day').toDate();
    return dayjs(date).add(daysToAdd, 'day').toDate();
  }
}

export default CalculateDateService;
