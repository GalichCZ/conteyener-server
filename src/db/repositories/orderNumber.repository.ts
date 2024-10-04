import { OrderNumberModel } from '../models'; // Adjust the path as necessary
import {
  OrderNumberInput,
  OrderNumberOutput,
} from '../models/OrderNumber.model';
import { IOrderNumberRepository } from './interfaces';
import { Op, Transaction } from 'sequelize';
import { OrderNumber } from '../../services/types/FollowingBody';

class OrderNumberRepository implements IOrderNumberRepository {
  async create(input: OrderNumberInput): Promise<OrderNumberOutput> {
    const orderNumber = await OrderNumberModel.create(input);
    return orderNumber.toJSON() as OrderNumberOutput;
  }

  async update(
    id: string,
    input: Partial<OrderNumberInput>,
    transaction?: Transaction
  ): Promise<OrderNumberOutput | null> {
    const orderNumber = await OrderNumberModel.findByPk(id);
    if (!orderNumber) {
      return null;
    }

    await orderNumber.update(input);
    return orderNumber.toJSON() as OrderNumberOutput;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await OrderNumberModel.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  async deleteByFollowingId(
    following_id: string,
    transaction?: Transaction
  ): Promise<boolean> {
    const options = transaction ? { transaction } : {};
    const deletedCount = await OrderNumberModel.destroy({
      where: { following_id },
      ...options,
    });

    return deletedCount > 0;
  }

  async updateManyByOrderNumberIds(
    order_numbers_input: OrderNumber[],
    transaction?: Transaction
  ): Promise<boolean> {
    const inputOrderNumbersWithIds = order_numbers_input.filter((n) => n.id);

    for (const inputOrderNumbersWithId of inputOrderNumbersWithIds) {
      const orderNumber = await this.findById(inputOrderNumbersWithId.id);
      if (!orderNumber) {
        return false;
      }

      await this.update(orderNumber.id, inputOrderNumbersWithId, transaction);
    }

    return true;
  }

  async deleteMissingOrderNumbers(
    missingIds: string[],
    transaction?: Transaction
  ): Promise<boolean> {
    const options = transaction ? { transaction } : {};

    const deletedCount = await OrderNumberModel.destroy({
      where: { id: { [Op.in]: missingIds } },
      ...options,
    });

    return deletedCount > 0;
  }

  async findById(id: string): Promise<OrderNumberOutput | null> {
    const orderNumber = await OrderNumberModel.findByPk(id);
    if (!orderNumber) {
      return null;
    }

    return orderNumber.toJSON() as OrderNumberOutput;
  }

  async findAll(): Promise<OrderNumberOutput[]> {
    const orderNumbers = await OrderNumberModel.findAll();
    return orderNumbers.map(
      (orderNumber) => orderNumber.toJSON() as OrderNumberOutput
    );
  }

  async findAllByFollowingId(following_id: string, transaction?: Transaction) {
    const options = transaction ? { transaction } : {};
    const orderNumbers = await OrderNumberModel.findAll({
      where: { following_id },
      ...options,
    });
    return orderNumbers.map(
      (orderNumber) => orderNumber.toJSON() as OrderNumberOutput
    );
  }

  async isAtLeastOneOrderNumber(
    order_numbers: string[],
    transaction?: Transaction
  ): Promise<string[]> {
    const options = transaction ? { transaction } : {};
    const orderNumbers = await OrderNumberModel.findAll({
      where: { number: { [Op.in]: order_numbers } },
      ...options,
    });
    return orderNumbers.map((orderNumber) => orderNumber.toJSON().number);
  }

  async createOrderNumbers(
    order_numbers: string[],
    following_id: string,
    transaction?: Transaction
  ): Promise<OrderNumberOutput[]> {
    const options = transaction ? { transaction } : {};

    const orderNumbers = await OrderNumberModel.bulkCreate(
      order_numbers.map((number) => ({ number, following_id })),
      options
    );
    return orderNumbers.map(
      (orderNumber) => orderNumber.toJSON() as OrderNumberOutput
    );
  }

  async getAllColumnValues(columnName: string): Promise<any> {
    const values = await OrderNumberModel.findAll({
      attributes: [columnName],
    });

    return values.map((value) => value.get(columnName));
  }
}

export default OrderNumberRepository;
