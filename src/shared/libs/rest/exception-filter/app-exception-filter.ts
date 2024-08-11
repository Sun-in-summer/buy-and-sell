import { NextFunction, Request, Response } from 'express';
import { ExceptionFilter } from './exception-filter.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../../types/component.enum.js';
import { LoggerInterface } from '../../logger/logger.interface.js';
import { StatusCodes } from 'http-status-codes';
import { createErrorObject } from '../../../helpers/common.js';
import { ApplicationError } from '../types/application-error.enum.js';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
  ) {
    this.logger.info('Register AppExceptionFilter');
  }

  public catch(error: Error , _req: Request, res: Response, _next: NextFunction) :void {

    this.logger.error(error.message, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ApplicationError.ServiceError, error.message));
  }
}
