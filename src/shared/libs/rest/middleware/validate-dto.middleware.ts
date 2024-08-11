import { ClassConstructor, plainToInstance } from 'class-transformer';
import { MiddlewareInterface } from './middleware.interface.js';
import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import { ValidationError } from '../errors/index.js';
import { reduceValidationErrors } from '../../../helpers/common.js';

export class ValidateDtoMiddleware implements MiddlewareInterface {
  constructor(private dto: ClassConstructor<object>){}

  public async execute ({body, path}: Request, _res: Response, next: NextFunction) : Promise<void> {
    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance);
    if(errors.length > 0) {
      throw new ValidationError(`Validation error: ${path}`, reduceValidationErrors(errors));
      return;
    }

    next();

  }
}
