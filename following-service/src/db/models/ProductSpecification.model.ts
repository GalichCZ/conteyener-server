import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import { SimpleProductModel } from './index';
import { ProductSpecificationType } from './interfaces';

export interface ProductSpecificationInput
  extends Optional<
    ProductSpecificationType,
    | 'id'
    | 'hs_code'
    | 'article_ved'
    | 'article_erp'
    | 'trade_mark'
    | 'model'
    | 'modification'
    | 'product_name'
    | 'manufacturer'
    | 'quantity_pieces'
    | 'quantity_places'
    | 'piece_price'
    | 'total_price'
    | 'weight_net'
    | 'weight_gross'
    | 'cbm'
  > {}
export interface ProductSpecificationOutput
  extends Required<ProductSpecificationType> {}

class ProductSpecificationModel
  extends Model<ProductSpecificationType, ProductSpecificationInput>
  implements ProductSpecificationType
{
  public id!: string;
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
  public simple_product_id!: string;
  public article_erp!: string;

  public readonly created_at!: Date;
  public readonly deleted_at!: Date;
  public readonly updated_at!: Date;
}

ProductSpecificationModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
    simple_product_id: {
      type: DataTypes.UUID,

      references: {
        model: 'simple_products',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'product_specifications',
    tableName: 'product_specifications',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

SimpleProductModel.hasMany(ProductSpecificationModel, {
  foreignKey: 'following_id',
  as: 'products',
});

ProductSpecificationModel.belongsTo(SimpleProductModel, {
  foreignKey: 'following_id',
  as: 'following',
});

export default ProductSpecificationModel;
