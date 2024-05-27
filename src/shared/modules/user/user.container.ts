import { Container } from 'inversify';

import { DefaultUserService } from './default-user.service.js';
import { UserService } from './user-service.interface.js';
import { Component } from '../../types/index.js';
import { UserEntity, UserModel } from './user.entity.js';
import { types } from '@typegoose/typegoose';


export function createUserContainer() {
  const userContainer = new Container();
  userContainer.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  return userContainer;
}
