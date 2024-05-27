
import { Container } from 'inversify';
import { ConfigInterface, RestConfig, RestSchema } from '../shared/libs/config/index.js';
import { DatabaseClientInterface, MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { LoggerInterface, PinoLogger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/index.js';
import RestApplication from './rest-application.js';


export function createRestApplicationContainer() {

  const restApplicationContainer = new Container();
  restApplicationContainer.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  restApplicationContainer.bind<LoggerInterface>(Component.LoggerInterface).to(PinoLogger).inSingletonScope();
  restApplicationContainer.bind<ConfigInterface<RestSchema>>(Component.ConfigInterface).to(RestConfig).inSingletonScope();
  restApplicationContainer.bind<DatabaseClientInterface>(Component.MongoDatabaseClient).to(MongoDatabaseClient).inSingletonScope();

  return restApplicationContainer;
}
