import { DeclarationStatusType } from './interfaces';
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

export interface DeclarationStatusInput
  extends Optional<DeclarationStatusType, 'id'> {}
export interface DeclarationStatusOutput
  extends Required<DeclarationStatusType> {}

class DeclarationStatusModel
  extends Model<DeclarationStatusType, DeclarationStatusInput>
  implements DeclarationStatusType
{
  public id!: string;
  public status!: string;
  public message!: string;
  public date!: Date;
  public declaration_number_id!: string;
  public created_at!: Date;
  public updated_at!: Date;
  public deleted_at!: Date;
}

DeclarationStatusModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    declaration_number_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'declarations',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'declaration_statuses',
    tableName: 'declaration_statuses',
    underscored: true,
    paranoid: true,
  }
);

export default DeclarationStatusModel;
