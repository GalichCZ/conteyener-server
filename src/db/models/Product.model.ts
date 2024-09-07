import { DataTypes, Model, Optional } from 'sequelize';
import { ProductType } from './interfaces';
import sequelize from '../db';

export interface ProductInput extends Optional<ProductType, 'id'> {}
export interface ProductOutput extends Required<ProductType> {}

class ProductModel
  extends Model<ProductType, ProductInput>
  implements ProductType
{
  public id!: string;
  public simple_name!: string;
  public hs_code!: string;
  public article_ved!: string;
  public cbm!: number;
  public trade_mark!: string;
  public model!: string;
  public modification!: string;
  public product_name!: string;
  public manufacturer!: string;
  public total_price!: number;
  public weight_gross!: number;
  public weight_net!: number;
  public piece_price!: number;
  public quantity_places!: number;
  public quantity_pieces!: number;
  public following_id!: string;
  public article_erp!: string;

  public readonly created_at!: Date;
  public readonly deleted_at!: Date;
  public readonly updated_at!: Date;
}

ProductModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    simple_name: {
      type: DataTypes.STRING(255),
    },
    hs_code: {
      type: DataTypes.STRING(255),
    },
    article_ved: {
      type: DataTypes.STRING(255),
    },
    article_erp: {
      type: DataTypes.STRING(255),
    },
    trade_mark: {
      type: DataTypes.STRING(255),
    },
    model: {
      type: DataTypes.STRING(255),
    },
    modification: {
      type: DataTypes.STRING(255),
    },
    product_name: {
      type: DataTypes.STRING(255),
    },
    manufacturer: {
      type: DataTypes.STRING(255),
    },
    quantity_pieces: {
      type: DataTypes.INTEGER,
    },
    quantity_places: {
      type: DataTypes.INTEGER,
    },
    piece_price: {
      type: DataTypes.FLOAT,
    },
    total_price: {
      type: DataTypes.FLOAT,
    },
    weight_net: {
      type: DataTypes.FLOAT,
    },
    weight_gross: {
      type: DataTypes.FLOAT,
    },
    cbm: {
      type: DataTypes.FLOAT,
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
    modelName: 'products',
    tableName: 'products',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default ProductModel;
