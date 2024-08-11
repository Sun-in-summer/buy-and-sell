import { inject, injectable } from 'inversify';
import { BaseController, HttpError, HttpMethod, UploadFileMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { LoggerInterface } from '../../libs/logger/logger.interface.js';
import { CreateUserRequest } from './create-user-request.type.js';
import { Request, Response } from 'express';
import { UserServiceInterface } from './user-service.interface.js';
import { RestSchema } from '../../libs/config/rest.schema.js';
import { ConfigInterface } from '../../libs/config/config.interface.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../helpers/common.js';
import { UserRdo } from './rdo/user.rdo.js';
import { LoginUserRequest } from './login-user-request.type.js';
import { ValidateDtoMiddleware } from '../../libs/rest/middleware/validate-dto.middleware.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { AuthServiceInterface } from '../auth/auth-service.interface.js';
import { LoggedUserRdo } from './rdo/logged-user.rdo.js';


@injectable()
export class UserController extends BaseController {

  constructor(
   @inject(Component.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(Component.UserService) private readonly userService: UserServiceInterface,
    @inject(Component.ConfigInterface) private readonly configService: ConfigInterface<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthServiceInterface,
  ){
    super(logger);
    this.logger.info('Register routes for UserController...');
    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]});
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [
        new ValidateDtoMiddleware(LoginUserDto)
      ]});
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,

    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
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


  public async login(
    {body}:LoginUserRequest,
    res: Response): Promise<void>{

    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, user);
    this.ok(res, Object.assign(responseData, {token}));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async checkAuthenticate(req: { tokenPayload: any; }, res: Response): Promise<void> {
    const tokenPayload = req.tokenPayload;
    const email = tokenPayload.email;
    const foundedUser = await this.userService.findByEmail(email);

    if (! foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(LoggedUserRdo, foundedUser));
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }
}

