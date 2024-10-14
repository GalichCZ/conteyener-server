import sequelize from '../db';
import { DataTypes, Model, Optional } from 'sequelize';
import { IsDocsType } from './interfaces';

export interface IsDocsInput extends Optional<IsDocsType, 'id'> {}
export interface IsDocsOutput extends Required<IsDocsType> {}

class IsDocsModel extends Model<IsDocsType, IsDocsInput> implements IsDocsType {
  public id!: string;
  public pi!: boolean;
  public ci!: boolean;
  public pl!: boolean;
  public ss_ds!: boolean;
  public contract_agrees!: boolean;
  public cost_agrees!: boolean;
  public instructions!: boolean;
  public ed!: boolean;
  public co!: boolean;
  public bill!: boolean;
  public ready_to_process!: boolean;
  public link_to_docs!: string | null;
  public order_id!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date;
}

IsDocsModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    pi: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    ci: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    pl: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    ss_ds: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    contract_agrees: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    cost_agrees: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    instructions: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    ed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    co: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    bill: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    ready_to_process: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    link_to_docs: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: true,
      unique: true,
      references: {
        model: 'order_numbers',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'is_docs',
    tableName: 'is_docs',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default IsDocsModel;
