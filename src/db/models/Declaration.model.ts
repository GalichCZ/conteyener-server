import { DeclarationType } from './interfaces';
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

export interface DeclarationInput extends Optional<DeclarationType, 'id'> {}
export interface DeclarationOutput extends Required<DeclarationType> {}

class DeclarationModel
  extends Model<DeclarationType, DeclarationInput>
  implements DeclarationType
{
  public id!: string;
  public number!: string;
  public following_id!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date;
}

DeclarationModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    number: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    following_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'followings', // Assumes you have a 'followings' table
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'declarations',
    tableName: 'declarations',
    underscored: true,
    paranoid: true,
  }
);

export default DeclarationModel;
