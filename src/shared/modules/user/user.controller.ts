import { inject, injectable } from 'inversify';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { LoggerInterface } from '../../libs/logger/logger.interface.js';
import { CreateUserRequest } from './create-user-request.type.js';
import { Response } from 'express';
import { UserServiceInterface } from './user-service.interface.js';
import { RestSchema } from '../../libs/config/rest.schema.js';
import { ConfigInterface } from '../../libs/config/config.interface.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../helpers/common.js';
import { UserRdo } from './rdo/user.rdo.js';
import { LoginUserRequest } from './login-user-request.type.js';


@injectable()
export class UserController extends BaseController {

  constructor(
   @inject(Component.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(Component.UserService) private readonly userService: UserServiceInterface,
    @inject(Component.ConfigInterface) private readonly configService: ConfigInterface<RestSchema>
  ){
    super(logger);
    this.logger.info('Register routes for UserController...');
    this.addRoute({path: '/register', method: HttpMethod.Post, handler: this.create});
  }


  public async create(
    {body}: CreateUserRequest,
    res: Response,
  ): Promise<void>{
    const existUser = await this.userService.findByEmail(body.email);

    if(existUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${body.email} exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }


  private async login({body}:LoginUserRequest, res: Response): Promise<void>{
    const existUser = await this.userService.findByEmail(body.email);
    if(!existUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController'
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'User Controller'
    );
  }
}