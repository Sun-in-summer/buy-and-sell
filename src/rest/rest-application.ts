import { inject, injectable } from 'inversify';
import { ConfigInterface , RestSchema } from '../shared/libs/config/index.js';
import {LoggerInterface} from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/component.enum.js';

@injectable()
export default class RestApplication {


  constructor(
    @inject(Component.LoggerInterface)private readonly logger: LoggerInterface,
    @inject(Component.ConfigInterface)private readonly config: ConfigInterface<RestSchema>,
  ) {

  }

  public async init() {
    this.logger.info('REST Application initialization...');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
  }
}
