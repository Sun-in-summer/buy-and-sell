import { inject, injectable } from 'inversify';
import { Component } from '../../../types/index.js';
import { ExceptionFilter } from './exception-filter.interface.js';
import { LoggerInterface } from '../../logger/logger.interface.js';
import { HttpError } from '../errors/index.js';
import { NextFunction, Request, Response } from 'express';
import { createErrorObject } from '../../../helpers/common.js';
import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from '../types/application-error.enum.js';


@injectable()
export class HttpErrorExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
  ) {
    this.logger.info('Register HttpErrorExceptionFilter');
  }

  public catch(error: unknown, req: Request, res: Response, next: NextFunction) :void {

    if(!(error instanceof HttpError)) {
      return next();
    }
    this.logger.error(`[HttpErrorException]: ${req.path} # ${error.message}`, error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ApplicationError.CommonError, error.message));
  }
}
