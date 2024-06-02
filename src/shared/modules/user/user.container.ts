import { Container } from 'inversify';

import { DefaultUserService } from './default-user.service.js';
import { UserServiceInterface } from './user-service.interface.js';
import { Component } from '../../types/index.js';
import { UserEntity, UserModel } from './user.entity.js';
import { types } from '@typegoose/typegoose';
import { UserController } from './user.controller.js';
import { ControllerInterface } from '../../libs/rest/index.js';


export function createUserContainer() {
  const userContainer = new Container();
  userContainer.bind<UserServiceInterface>(Component.UserService).to(DefaultUserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  userContainer.bind<ControllerInterface>(Component.UserController).to(UserController).inSingletonScope();
  return userContainer;
}
