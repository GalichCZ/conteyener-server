import { Model, Optional, DataTypes } from 'sequelize';
import { StoreType } from './interfaces';
import sequelize from '../db';

export interface StoreInput extends Optional<StoreType, 'id'> {}
export interface StoreOutput extends Required<StoreType> {}

class StoreModel extends Model<StoreType, StoreInput> implements StoreType {
  public id!: string;
  public name!: string;
  public receiver!: string;
  public address!: string;
  public contact!: string;
  public note!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date;
}

StoreModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    receiver: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    contact: {
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
    modelName: 'stores',
    tableName: 'stores',
    underscored: true,
  }
);

export default StoreModel;
