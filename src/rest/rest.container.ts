
import { Container } from 'inversify';
import { ConfigInterface, RestConfig, RestSchema } from '../shared/libs/config/index.js';
import { DatabaseClientInterface, MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { LoggerInterface, PinoLogger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/index.js';
import RestApplication from './rest-application.js';
import { AppExceptionFilter, ExceptionFilter, ValidationExceptionFilter } from '../shared/libs/rest/index.js';
import { HttpErrorExceptionFilter } from '../shared/libs/rest/exception-filter/http-error.exception-filter.js';
import { PathTransformer } from '../shared/libs/rest/transform/path-transformer.js';


export function createRestApplicationContainer() {

  const restApplicationContainer = new Container();
  restApplicationContainer.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  restApplicationContainer.bind<LoggerInterface>(Component.LoggerInterface).to(PinoLogger).inSingletonScope();
  restApplicationContainer.bind<ConfigInterface<RestSchema>>(Component.ConfigInterface).to(RestConfig).inSingletonScope();
  restApplicationContainer.bind<DatabaseClientInterface>(Component.MongoDatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  restApplicationContainer.bind<ExceptionFilter>(Component.ExceptionFilter).to(AppExceptionFilter).inSingletonScope();
  restApplicationContainer.bind<ExceptionFilter>(Component.HttpExceptionFilter).to(HttpErrorExceptionFilter).inSingletonScope();
  restApplicationContainer.bind<ExceptionFilter>(Component.ValidationExceptionFilter).to(ValidationExceptionFilter).inSingletonScope();
  restApplicationContainer.bind<PathTransformer>(Component.PathTransformer).to(PathTransformer).inSingletonScope();
  return restApplicationContainer;
}
