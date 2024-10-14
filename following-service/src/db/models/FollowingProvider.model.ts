import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import { FollowingProviderType } from './interfaces';

export interface FollowingProviderInput
  extends Optional<FollowingProviderType, 'id'> {}
export interface FollowingProviderOutput
  extends Required<FollowingProviderType> {}

class FollowingProviderModel
  extends Model<FollowingProviderType, FollowingProviderInput>
  implements FollowingProviderType
{
  public id!: string;
  public provider_id!: string;
  public following_id!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date;
}

FollowingProviderModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    provider_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'providers',
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
    modelName: 'following_provider',
    tableName: 'following_provider',
    underscored: true,
    paranoid: true,
  }
);

export default FollowingProviderModel;
