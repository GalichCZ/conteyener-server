import {
  CalculatedDateModel,
  ContainerTypeModel,
  DeliveryChannelModel,
  DeliveryMethodModel,
  FollowingModel,
  OrderNumberModel,
  ProviderModel,
  StockPlaceModel,
  StoreModel,
  DeclarationModel,
  FollowingProviderModel,
  SimpleProductModel,
  KmToDistCalculateModel,
} from './index';

console.log({
  CalculatedDateModel,
  ContainerTypeModel,
  DeliveryChannelModel,
  DeliveryMethodModel,
  FollowingModel,
  OrderNumberModel,
  ProviderModel,
  StockPlaceModel,
  StoreModel,
  DeclarationModel,
  FollowingProviderModel,
  SimpleProductModel,
});

export const setUpAssociations = () => {
  FollowingModel.hasMany(SimpleProductModel, {
    foreignKey: 'following_id',
    as: 'simple_products',
  });

  SimpleProductModel.belongsTo(FollowingModel, {
    foreignKey: 'following_id',
    as: 'following',
  });

  FollowingModel.hasMany(DeclarationModel, {
    foreignKey: 'following_id',
    as: 'declarations',
  });

  DeclarationModel.belongsTo(FollowingModel, {
    foreignKey: 'following_id',
    as: 'following',
  });

  FollowingModel.hasOne(KmToDistCalculateModel, {
    foreignKey: 'following_id',
    as: 'km_to_dist_calculate',
  });

  KmToDistCalculateModel.belongsTo(FollowingModel, {
    foreignKey: 'following_id',
    as: 'following',
  });

  FollowingModel.hasOne(CalculatedDateModel, {
    foreignKey: 'following_id',
    as: 'calculated_dates',
  });

  CalculatedDateModel.belongsTo(FollowingModel, {
    foreignKey: 'following_id',
    as: 'following',
  });

  FollowingModel.hasMany(OrderNumberModel, {
    foreignKey: 'following_id',
    as: 'order_numbers',
  });

  OrderNumberModel.belongsTo(FollowingModel, {
    foreignKey: 'following_id',
    as: 'following',
  });

  FollowingModel.belongsTo(StockPlaceModel, {
    foreignKey: 'stock_place_id',
    as: 'stock_places',
    onDelete: 'SET NULL',
  });

  FollowingModel.belongsTo(DeliveryChannelModel, {
    foreignKey: 'delivery_channel_id',
    as: 'delivery_channels',
    onDelete: 'SET NULL',
  });

  FollowingModel.belongsTo(ContainerTypeModel, {
    foreignKey: 'container_type_id',
    as: 'container_types',
    onDelete: 'SET NULL',
  });

  FollowingModel.belongsTo(DeliveryMethodModel, {
    foreignKey: 'delivery_method_id',
    as: 'delivery_methods',
    onDelete: 'SET NULL',
  });

  FollowingModel.belongsTo(StoreModel, {
    foreignKey: 'store_id',
    as: 'stores',
    onDelete: 'SET NULL',
  });

  FollowingModel.belongsToMany(ProviderModel, {
    through: FollowingProviderModel, // Name of the junction table
    foreignKey: 'following_id', // Foreign key in the junction table for Followings
    otherKey: 'provider_id', // Foreign key in the junction table for Providers
  });

  ProviderModel.belongsToMany(FollowingModel, {
    through: FollowingProviderModel,
    foreignKey: 'provider_id',
    otherKey: 'following_id',
  });
};
