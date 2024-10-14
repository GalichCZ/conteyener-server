import { DataTypes, Model, Optional } from 'sequelize';
import { SimpleProductType } from './interfaces';
import sequelize from '../db';

export interface ProductInput extends Optional<SimpleProductType, 'id'> {}
export interface ProductOutput extends Required<SimpleProductType> {}

class SimpleProductModel
  extends Model<SimpleProductType, ProductInput>
  implements SimpleProductType
{
  public id!: string;
  public simple_name!: string;
  public following_id!: string;

  public readonly created_at!: Date;
  public readonly deleted_at!: Date;
  public readonly updated_at!: Date;
}

SimpleProductModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    simple_name: {
      type: DataTypes.STRING(255),
    },
    following_id: {
      type: DataTypes.UUID,

      references: {
        model: 'followings',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'simple_products',
    tableName: 'simple_products',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default SimpleProductModel;
