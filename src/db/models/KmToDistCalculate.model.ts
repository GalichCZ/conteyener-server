import { Model, Optional, DataTypes } from 'sequelize';
import { KmToDistCalculateType } from './interfaces';
import sequelize from '../db';

export interface KmToDistCalculateInput
  extends Optional<KmToDistCalculateType, 'id'> {}
export interface KmToDistCalculateOutput
  extends Required<KmToDistCalculateType> {}

class KmToDistCalculateModel
  extends Model<KmToDistCalculateType, KmToDistCalculateInput>
  implements KmToDistCalculateType
{
  public id!: string;
  public km_to_dist!: number;
  public km_was_updated!: boolean;
  public following_id!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

KmToDistCalculateModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    km_to_dist: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    km_was_updated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    following_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'followings', // Assumes you have a 'followings' table
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
    sequelize: sequelize,
    modelName: 'km_to_dist_calculates',
    tableName: 'km_to_dist_calculates',
    underscored: true,
  }
);

export default KmToDistCalculateModel;
