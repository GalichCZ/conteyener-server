import { IStockPlaceRepository } from './interfaces';
import { StockPlaceInput, StockPlaceOutput } from '../models/StockPlace.model';
import { StockPlaceModel } from '../models';
import { Transaction } from 'sequelize';

class StockPlaceRepository implements IStockPlaceRepository {
  async create(stockPlaceInput: StockPlaceInput): Promise<StockPlaceOutput> {
    const stockPlace = await StockPlaceModel.create(stockPlaceInput);
    return stockPlace.toJSON() as StockPlaceOutput;
  }

  async update(
    id: string,
    stockPlaceInput: Partial<StockPlaceInput>
  ): Promise<StockPlaceOutput | null> {
    const stockPlace = await StockPlaceModel.findByPk(id);
    if (!stockPlace) {
      return null;
    }

    await stockPlace.update(stockPlaceInput);
    return stockPlace.toJSON() as StockPlaceOutput;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await StockPlaceModel.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  async findById(
    id: string,
    transaction?: Transaction
  ): Promise<StockPlaceOutput | null> {
    const options = transaction ? { transaction } : {};
    const stockPlace = await StockPlaceModel.findByPk(id, { ...options });
    if (!stockPlace) {
      return null;
    }

    return stockPlace.toJSON() as StockPlaceOutput;
  }

  async findAll(): Promise<StockPlaceOutput[]> {
    const stockPlaces = await StockPlaceModel.findAll();
    return stockPlaces.map(
      (stockPlace) => stockPlace.toJSON() as StockPlaceOutput
    );
  }

  async getAllColumnValues(columnName: string): Promise<any> {
    const values = await StockPlaceModel.findAll({
      attributes: [columnName],
    });

    return values.map((value) => value.get(columnName));
  }
}

export default StockPlaceRepository;
