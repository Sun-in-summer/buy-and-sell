
import { config} from 'dotenv';
import { LoggerInterface } from '../logger/index.js';
import { ConfigInterface } from './config.interface.js';
import {configRestSchema,  RestSchema } from './rest.schema.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.enum.js';

@injectable()
export  class  RestConfig implements ConfigInterface<RestSchema>{
  private readonly config: RestSchema;

  constructor(
    @inject(Component.LoggerInterface)private readonly logger: LoggerInterface
  ) {
    const parsedOutput = config();

    if(parsedOutput.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }
    configRestSchema.load({});
    configRestSchema.validate({allowed: 'strict', output: this.logger.info});
    this.config = configRestSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');


  }


  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
