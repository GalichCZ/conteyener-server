import sequelize from '../db';
import { DataTypes, Model, Optional } from 'sequelize';
import { OrderNumberType } from './interfaces';
import { FollowingModel } from './index';

export interface OrderNumberInput extends Optional<OrderNumberType, 'id'> {}
export interface OrderNumberOutput extends Required<OrderNumberType> {}

class OrderNumberModel
  extends Model<OrderNumberType, OrderNumberInput>
  implements OrderNumberType
{
  public id!: string;
  public number!: string;
  public following_id!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date;
}

OrderNumberModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    number: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: false,
    },
    following_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'followings',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'order_numbers',
    tableName: 'order_numbers',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

FollowingModel.hasMany(OrderNumberModel, {
  foreignKey: 'following_id',
  as: 'order_numbers',
});

OrderNumberModel.belongsTo(FollowingModel, {
  foreignKey: 'following_id',
  as: 'following',
});

export default OrderNumberModel;
