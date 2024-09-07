import { DataTypes, Model, Optional } from 'sequelize';
import { ProviderType } from './interfaces';
import sequelize from '../db';

export interface ProviderInput extends Optional<ProviderType, 'id'> {}
export interface ProviderOutput extends Required<ProviderType> {}

class ProviderModel
  extends Model<ProviderType, ProviderInput>
  implements ProviderType
{
  public id!: string;
  public name!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date;
}

ProviderModel.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    sequelize: sequelize,
    paranoid: true,
    modelName: 'providers',
    tableName: 'providers',
    underscored: true,
  }
);

export default ProviderModel;
