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

  FollowingModel.hasMany(OrderNumberModel, {
    foreignKey: 'following_id',
    as: 'order_numbers',
  });

  FollowingModel.hasMany(CalculatedDateModel, {
    foreignKey: 'following_id',
    as: 'calculated_dates',
  });

  OrderNumberModel.belongsTo(FollowingModel, {
    foreignKey: 'following_id',
    as: 'following',
  });

  CalculatedDateModel.belongsTo(FollowingModel, {
    foreignKey: 'following_id',
    as: 'following',
  });

  FollowingModel.belongsTo(StockPlaceModel, {
    foreignKey: 'stock_place_id',
    as: 'stockPlace',
    onDelete: 'SET NULL',
  });

  FollowingModel.belongsTo(DeliveryChannelModel, {
    foreignKey: 'delivery_channel_id',
    as: 'deliveryChannel',
    onDelete: 'SET NULL',
  });

  FollowingModel.belongsTo(ContainerTypeModel, {
    foreignKey: 'container_type_id',
    as: 'containerType',
    onDelete: 'SET NULL',
  });

  FollowingModel.belongsTo(DeliveryMethodModel, {
    foreignKey: 'delivery_method_id',
    as: 'deliveryMethod',
    onDelete: 'SET NULL',
  });

  FollowingModel.belongsTo(StoreModel, {
    foreignKey: 'store_id',
    as: 'store',
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
