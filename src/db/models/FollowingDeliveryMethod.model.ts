import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import { FollowingDeliveryMethodType } from './interfaces';

export interface FollowingDeliveryMethodInput
  extends Optional<FollowingDeliveryMethodType, 'id'> {}
export interface FollowingDeliveryMethodOutput
  extends Required<FollowingDeliveryMethodType> {}

class FollowingDeliveryMethodModel
  extends Model<FollowingDeliveryMethodType, FollowingDeliveryMethodInput>
  implements FollowingDeliveryMethodType
{
  public id!: string;
  public delivery_method_id!: string;
  public following_id!: string;
  public created_at!: Date;
  public updated_at!: Date;
  public deleted_at!: Date;
}

FollowingDeliveryMethodModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    delivery_method_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'delivery_methods',
        key: 'id',
      },
    },
    following_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'followings',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'following_delivery_method',
    tableName: 'following_delivery_method',
    underscored: true,
    paranoid: true,
  }
);

export default FollowingDeliveryMethodModel;
