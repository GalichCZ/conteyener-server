import { OrderNumberModel } from '../models'; // Adjust the path as necessary
import {
  OrderNumberInput,
  OrderNumberOutput,
} from '../models/OrderNumber.model';
import { IOrderNumberRepository } from './interfaces/orderNumber-repository.interface';
import { Op, Transaction } from 'sequelize';

class OrderNumberRepository implements IOrderNumberRepository {
  async create(input: OrderNumberInput): Promise<OrderNumberOutput> {
    const orderNumber = await OrderNumberModel.create(input);
    return orderNumber.toJSON() as OrderNumberOutput;
  }

  async update(
    id: string,
    input: Partial<OrderNumberInput>
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
}

export default OrderNumberRepository;
