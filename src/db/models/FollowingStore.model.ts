import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import { FollowingStoreType } from './interfaces';
import { FollowingModel, StoreModel } from './index';

export interface FollowingStoreInput
  extends Optional<FollowingStoreType, 'id'> {}
export interface FollowingStoreOutput extends Required<FollowingStoreType> {}

class FollowingStoreModel
  extends Model<FollowingStoreType, FollowingStoreInput>
  implements FollowingStoreType
{
  public id!: string;
  public store_id!: string;
  public following_id!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date;
}

FollowingStoreModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    store_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'stores',
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
    modelName: 'following_store',
    tableName: 'following_store',
    underscored: true,
    paranoid: true,
  }
);

FollowingModel.belongsToMany(StoreModel, {
  through: FollowingStoreModel,
  foreignKey: 'following_id',
  otherKey: 'store_id',
});

StoreModel.belongsToMany(FollowingModel, {
  through: FollowingStoreModel,
  foreignKey: 'store_id',
  otherKey: 'following_id',
});

export default FollowingStoreModel;
