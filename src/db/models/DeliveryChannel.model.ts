import { DataTypes, Model, Optional } from 'sequelize';
import { DeliveryChannelType } from './interfaces';
import sequelize from '../db';

export interface DeliveryChannelInput
  extends Optional<DeliveryChannelType, 'id'> {}
export interface DeliveryChannelOutput extends Required<DeliveryChannelType> {}

class DeliveryChannelModel
  extends Model<DeliveryChannelType, DeliveryChannelInput>
  implements DeliveryChannelType
{
  public id!: string;
  public name!: string;
  public eta!: number;
  public date_do!: number;
  public declaration_issue_date!: number;
  public train_arrive_date!: number;
  public train_depart_date!: number;
  public store_arrive_date!: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date;
}

DeliveryChannelModel.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    eta: {
      type: DataTypes.NUMBER,
    },
    date_do: {
      type: DataTypes.NUMBER,
    },
    declaration_issue_date: {
      type: DataTypes.NUMBER,
    },
    train_depart_date: {
      type: DataTypes.NUMBER,
    },
    train_arrive_date: {
      type: DataTypes.NUMBER,
    },
    store_arrive_date: {
      type: DataTypes.NUMBER,
    },
  },
  {
    timestamps: true,
    sequelize: sequelize,
    paranoid: true,
    modelName: 'deliveryChannels',
    underscored: true,
  }
);

export default DeliveryChannelModel;
