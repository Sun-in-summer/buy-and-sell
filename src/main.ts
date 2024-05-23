import { Container } from 'inversify';
import 'reflect-metadata';
import RestApplication from './rest/rest-application.js';
import { LoggerInterface, PinoLogger } from './shared/libs/logger/index.js';
import { Component } from './shared/types/component.enum.js';
import { ConfigInterface, RestConfig, RestSchema } from './shared/libs/config/index.js';


async function bootstrap () {
  const container = new Container();
  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<LoggerInterface>(Component.LoggerInterface).to(PinoLogger).inSingletonScope();
  container.bind<ConfigInterface<RestSchema>>(Component.ConfigInterface).to(RestConfig).inSingletonScope();


  const application = container.get<RestApplication>(Component.RestApplication);
  await application.init();

}

bootstrap();
