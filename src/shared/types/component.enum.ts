

export const Component = {
  RestApplication: Symbol.for('RestApplication'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  MongoDatabaseClient: Symbol.for('MongoDatabaseClient'),
  UserService: Symbol.for('UserService'),
  UserModel: Symbol.for('UserModel'),
  CategoryService: Symbol.for ('CategoryService'),
  CategoryModel: Symbol.for('CategoryModel'),
  OfferService: Symbol.for('OfferService'),
  OfferModel: Symbol.for('OfferModel'),
} as const;
