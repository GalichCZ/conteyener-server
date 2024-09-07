import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import { FollowingContainerTypeType } from './interfaces';

export interface FollowingContainerTypeInput
  extends Optional<FollowingContainerTypeType, 'id'> {}
export interface FollowingContainerTypeOutput
  extends Required<FollowingContainerTypeType> {}

class FollowingContainerTypeModel
  extends Model<FollowingContainerTypeType, FollowingContainerTypeInput>
  implements FollowingContainerTypeType
{
  public id!: string;
  public container_type_id!: string;
  public following_id!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date;
}

FollowingContainerTypeModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    container_type_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'container_types',
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
    modelName: 'following_container_type',
    tableName: 'following_container_type',
    underscored: true,
    paranoid: true,
  }
);

export default FollowingContainerTypeModel;
