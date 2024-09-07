import { IStockPlaceRepository } from './interfaces/stockPlace-repository.interface';
import { StockPlaceInput, StockPlaceOutput } from '../models/StockPlace.model';
import { StockPlaceModel } from '../models';

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

  async findById(id: string): Promise<StockPlaceOutput | null> {
    const stockPlace = await StockPlaceModel.findByPk(id);
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
}

export default StockPlaceRepository;
