import { DataTypes, Model, Optional } from 'sequelize';
import { FollowingType } from './interfaces';
import sequelize from '../db';
import { FollowingStoreModel } from './index';

export interface FollowingInput
  extends Optional<
    FollowingType,
    | 'id'
    | 'answer_of_ob'
    | 'availability_of_ob'
    | 'bl_smgs_cmr'
    | 'container_number'
    | 'destination_station'
    | 'expeditor'
    | 'fraht'
    | 'inside_number'
    | 'line'
    | 'load_date'
    | 'pickup'
    | 'port'
    | 'proform_number'
    | 'ready_date'
    | 'release'
    | 'td'
  > {}
export interface FollowingOutput extends Required<FollowingType> {}

//TODO: change store to one to one

class FollowingModel
  extends Model<FollowingType, FollowingInput>
  implements FollowingType
{
  public agent!: string;
  public answer_of_ob!: Date | null;
  public availability_of_ob!: Date | null;
  public bl_smgs_cmr!: boolean;
  public conditions!: string[];
  public container_number!: string | null;
  public destination_station!: string | null;
  public direction!: string;
  public expeditor!: string | null;
  public fraht!: string | null;
  public hidden!: boolean;
  public id!: string;
  public importers!: string[];
  public inside_number!: string[] | null;
  public line!: string | null;
  public load_date!: Date | null;
  public pickup!: string | null;
  public place_of_dispatch!: string;
  public port!: string | null;
  public proform_number!: string[] | null;
  public ready_date!: Date | null;
  public release!: Date | null;
  public request_date!: Date;
  public td!: boolean;

  public readonly created_at!: Date;
  public readonly deleted_at!: Date;
  public readonly updated_at!: Date;
}

FollowingModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    request_date: {
      type: DataTypes.DATE,
    },
    inside_number: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
    },
    proform_number: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
    },
    container_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    importers: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
    conditions: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
    direction: {
      type: DataTypes.STRING(255),
    },
    agent: {
      type: DataTypes.STRING(255),
    },
    place_of_dispatch: {
      type: DataTypes.STRING(255),
    },
    line: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ready_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    load_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    release: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    bl_smgs_cmr: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    td: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    port: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    availability_of_ob: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    answer_of_ob: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expeditor: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    destination_station: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    pickup: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fraht: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: sequelize,
    modelName: 'followings',
    underscored: true,
  }
);

// FollowingModel.hasMany(FollowingStoreModel, {
//   as: 'followingStores',
//   foreignKey: 'following_id',
// });

export default FollowingModel;
