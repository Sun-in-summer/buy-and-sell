import { Container } from 'inversify';
import { AuthServiceInterface } from './auth-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { DefaultAuthService } from './default-auth.service.js';
import { AuthExceptionFilter } from './auth.exception-filter.js';

export function createAuthContainer () {
  const authContainer = new Container();
  authContainer.bind<AuthServiceInterface>(Component.AuthService).to(DefaultAuthService).inSingletonScope();
  authContainer.bind<AuthExceptionFilter>(Component.AuthExceptionFilter).to(AuthExceptionFilter).inSingletonScope();

  return authContainer;
}
