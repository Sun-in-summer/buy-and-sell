import 'reflect-metadata';
import { Container } from 'inversify';
import RestApplication from './rest/rest-application.js';
import { Component } from './shared/types/component.enum.js';
import { createRestApplicationContainer } from './rest/rest.container.js';
import { createUserContainer } from './shared/modules/user/index.js';


async function bootstrap () {
  const appContainer = Container.merge(createRestApplicationContainer(), createUserContainer());


  const application = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();

}

bootstrap();
