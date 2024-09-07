import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import { FollowingStockPlaceType } from './interfaces';

export interface FollowingStockPlaceInput
  extends Optional<FollowingStockPlaceType, 'id'> {}
export interface FollowingStockPlaceOutput
  extends Required<FollowingStockPlaceType> {}

class FollowingStockPlaceModel
  extends Model<FollowingStockPlaceType, FollowingStockPlaceInput>
  implements FollowingStockPlaceType
{
  public id!: string;
  public stock_place_id!: string;
  public following_id!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date;
}

FollowingStockPlaceModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    stock_place_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'stock_places',
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
    modelName: 'following_stock_place',
    tableName: 'following_stock_place',
    underscored: true,
    paranoid: true,
  }
);

export default FollowingStockPlaceModel;
