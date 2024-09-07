import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import { FollowingDeliveryChannelType } from './interfaces';
import { DeliveryChannelModel, FollowingModel } from './index';

export interface FollowingDeliveryChannelInput
  extends Optional<FollowingDeliveryChannelType, 'id'> {}
export interface FollowingDeliveryChannelOutput
  extends Required<FollowingDeliveryChannelType> {}

class FollowingDeliveryChannelModel
  extends Model<FollowingDeliveryChannelType, FollowingDeliveryChannelInput>
  implements FollowingDeliveryChannelType
{
  public id!: string;
  public delivery_channel_id!: string;
  public following_id!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date;
}

FollowingDeliveryChannelModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    delivery_channel_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'delivery_channels',
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
    modelName: 'following_delivery_channel',
    tableName: 'following_delivery_channel',
    underscored: true,
    paranoid: true,
  }
);

FollowingModel.belongsToMany(DeliveryChannelModel, {
  through: FollowingDeliveryChannelModel,
  foreignKey: 'following_id',
  otherKey: 'delivery_channel_id',
});

DeliveryChannelModel.belongsToMany(FollowingModel, {
  through: FollowingDeliveryChannelModel,
  foreignKey: 'delivery_channel_id',
  otherKey: 'following_id',
});

export default FollowingDeliveryChannelModel;
