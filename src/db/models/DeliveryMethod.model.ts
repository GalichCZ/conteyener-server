import { DeliveryMethodType } from './interfaces';
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

export interface DeliveryMethodInput
  extends Optional<DeliveryMethodType, 'id'> {}
export interface DeliveryMethodOutput extends Required<DeliveryMethodType> {}

class DeliveryMethodModel
  extends Model<DeliveryMethodType, DeliveryMethodInput>
  implements DeliveryMethodType
{
  public id!: string;
  public description!: string;
  public method!: string;

  public readonly deleted_at!: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

DeliveryMethodModel.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
    },
    method: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    sequelize: sequelize,
    paranoid: true,
    modelName: 'deliveryMethods',
    underscored: true,
  }
);

export default DeliveryMethodModel;
