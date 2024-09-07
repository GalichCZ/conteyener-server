import { DataTypes, Model, Optional } from 'sequelize';
import { ContainerTypeType } from './interfaces/ContainerType.type';
import sequelize from '../db';

export interface ContainerTypeInput extends Optional<ContainerTypeType, 'id'> {}
export interface ContainerTypeOutput extends Required<ContainerTypeType> {}

class ContainerTypeModel
  extends Model<ContainerTypeType, ContainerTypeInput>
  implements ContainerTypeType
{
  public id!: string;
  public type_name!: string;

  public readonly created_at!: Date;
  public readonly deleted_at!: Date;
  public readonly updated_at!: Date;
}

ContainerTypeModel.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type_name: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    sequelize: sequelize,
    paranoid: true,
    modelName: 'containerTypes',
    underscored: true,
  }
);

export default ContainerTypeModel;
