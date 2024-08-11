import { Types } from 'mongoose';
import { MiddlewareInterface } from './middleware.interface.js';
import { HttpError } from '../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

export class ValidateObjectIdMiddleware implements MiddlewareInterface{
  constructor(private param: string){}

  public execute({params}: Request, _res: Response, next: NextFunction): void {
    const objectId = params[this.param];

    if(Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${objectId} is invalid ObjectID`,
      'ValidateObjectIdMiddleware');
  }
}
