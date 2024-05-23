import { pino, Logger as PinoInstance, transport} from 'pino';
import { LoggerInterface } from './logger.interface.js';
import { getCurrentModuleDirectoryPath } from '../../helpers/index.js';
import { resolve } from 'node:path';
import { injectable } from 'inversify';


@injectable()
export  class PinoLogger implements LoggerInterface{
  private logger!: PinoInstance;

  constructor() {
    const modulePath = getCurrentModuleDirectoryPath();
    const logFilePath = 'logs/rest.log';
    const destination = resolve(modulePath, '../../../', logFilePath);

    const multiTransport = transport({
      targets: [{
        target: 'pino/file',
        options: {destination},
        level: 'debug'
      },{
        target: 'pino/file',
        options: {},
        level: 'info'
      }] ,
    });

    this.logger =pino({}, multiTransport);
    this.logger.info('Logger created…');
  }


  public info(message: string, ...args: unknown[]):void {
    this.logger.info(message, ...args);
  }

  public warn(message: string, ...args: unknown[]):void {
    this.logger.warn(message, ...args);
  }

  public error(message: string, ...args: unknown[]):void {
    this.logger.error(message, ...args);
  }

  public debug(message: string, ...args: unknown[]):void {
    this.logger.debug(message, ...args);
  }
}
