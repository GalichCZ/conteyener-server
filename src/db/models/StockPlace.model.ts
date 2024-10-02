import { Model, Optional, DataTypes } from 'sequelize';
import { StockPlaceType } from './interfaces';
import sequelize from '../db';

export interface StockPlaceInput extends Optional<StockPlaceType, 'id'> {}
export interface StockPlaceOutput extends Required<StockPlaceType> {}

class StockPlaceModel
  extends Model<StockPlaceType, StockPlaceInput>
  implements StockPlaceType
{
  public id!: string;
  public name!: string;
  public contact!: string;
  public address!: string;
  public note!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date;
}

StockPlaceModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
    },
    contact: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    note: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    sequelize: sequelize,
    paranoid: true,
    modelName: 'stock_places',
    tableName: 'stock_places',
    underscored: true,
  }
);

export default StockPlaceModel;
