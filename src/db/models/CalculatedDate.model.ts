import { DataTypes, Model, Optional } from 'sequelize';
import { CalculatedDatesType } from './interfaces';
import sequelize from '../db';

export interface CalculatedDateInput
  extends Optional<CalculatedDatesType, 'id'> {}
export interface CalculatedDateOutput extends Required<CalculatedDatesType> {}

class CalculatedDateModel
  extends Model<CalculatedDatesType, CalculatedDateInput>
  implements CalculatedDatesType
{
  public id!: string;
  public etd!: Date;
  public eta!: Date;
  public eta_update!: boolean;
  public date_do!: Date;
  public date_do_update!: boolean;
  public declaration_issue_date!: Date;
  public declaration_issue_date_update!: boolean;
  public store_arrive_date!: Date;
  public store_arrive_date_update!: boolean;
  public train_arrive_date!: Date;
  public train_arrive_date_update!: boolean;
  public train_depart_date!: Date;
  public train_depart_date_update!: boolean;
  public following_id!: string;

  public readonly created_at!: Date;
  public readonly deleted_at!: Date;
  public readonly updated_at!: Date;
}

CalculatedDateModel.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
    },
    etd: {
      type: DataTypes.DATE,
    },
    eta: {
      type: DataTypes.DATE,
    },
    eta_update: {
      type: DataTypes.BOOLEAN,
    },
    date_do: {
      type: DataTypes.DATE,
    },
    date_do_update: {
      type: DataTypes.BOOLEAN,
    },
    declaration_issue_date: {
      type: DataTypes.DATE,
    },
    declaration_issue_date_update: {
      type: DataTypes.BOOLEAN,
    },
    store_arrive_date: {
      type: DataTypes.DATE,
    },
    store_arrive_date_update: {
      type: DataTypes.BOOLEAN,
    },
    train_arrive_date: {
      type: DataTypes.DATE,
    },
    train_arrive_date_update: {
      type: DataTypes.BOOLEAN,
    },
    train_depart_date: {
      type: DataTypes.DATE,
    },
    train_depart_date_update: {
      type: DataTypes.BOOLEAN,
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
    paranoid: true,
    modelName: 'calculatedDates',
    underscored: true,
  }
);

export default CalculatedDateModel;
