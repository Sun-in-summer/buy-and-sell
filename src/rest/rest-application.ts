import { inject, injectable } from 'inversify';
import { ConfigInterface , RestSchema } from '../shared/libs/config/index.js';
import {LoggerInterface} from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/component.enum.js';
import { MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/database.js';
import express, { Express } from 'express';
import { ControllerInterface, ExceptionFilter } from '../shared/libs/rest/index.js';
import { ParseTokenMiddleware } from '../shared/libs/rest/middleware/parse-token.middleware.js';
import { getFullServerPath } from '../shared/helpers/common.js';
import { STATIC_FILES_ROUTE, STATIC_UPLOAD_ROUTE } from './rest.constant.js';
import cors from 'cors';


@injectable()
export default class RestApplication {
  private readonly server: Express;


  constructor(
    @inject(Component.LoggerInterface)private readonly logger: LoggerInterface,
    @inject(Component.ConfigInterface)private readonly config: ConfigInterface<RestSchema>,
    @inject(Component.MongoDatabaseClient)private readonly databaseClient: MongoDatabaseClient,
    @inject(Component.CategoryController) private categoryController: ControllerInterface,
    @inject(Component.ExceptionFilter) private appExceptionFilter: ExceptionFilter,
    @inject(Component.UserController) private userController: ControllerInterface,
    @inject(Component.OfferController) private readonly offerController: ControllerInterface,
    @inject(Component.CommentController) private readonly commentController: ControllerInterface,
    @inject(Component.AuthExceptionFilter) private readonly authExceptionFilter: ExceptionFilter,
    @inject(Component.HttpExceptionFilter) private readonly httpExceptionFilter: ExceptionFilter,
    @inject(Component.ValidationExceptionFilter) private readonly validationExceptioFilter: ExceptionFilter,
  ) {
    this.server = express();
  }

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),

    );

    return this.databaseClient.connect(mongoUri);
  }

  private async _initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async _initControllers() {
    this.server.use('/categories', this.categoryController.router);
    this.server.use('/users', this.userController.router);
    this.server.use('/:offers', this.offerController.router);
    this.server.use('/comments', this.commentController.router);
  }


  private async _initMiddleware() {
    const authentificateMiddleware = new ParseTokenMiddleware(this.config.get('JWT_SECRET'));
    this.server.use(express.json());
    this.server.use(
      STATIC_UPLOAD_ROUTE,
      express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
    this.server.use(
      STATIC_FILES_ROUTE,
      express.static(this.config.get('STATIC_DIRECTORY_PATH'))
    );
    this.server.use(authentificateMiddleware.execute.bind(authentificateMiddleware));
    this.server.use(cors());
  }

  private async _initExceptionFilters() {
    this.server.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
    this.server.use(this.validationExceptioFilter.catch.bind(this.validationExceptioFilter));
    this.server.use(this.httpExceptionFilter.catch.bind(this.httpExceptionFilter));
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }


  public async init() {
    this.logger.info('REST Application initialization...');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database');
    await this._initDb();
    this.logger.info('Init database completed');

    this.logger.info('Init app-level middleware');
    await this._initMiddleware();
    this.logger.info('App-level middleware initialization completed');

    this.logger.info('Init controllers');
    await this._initControllers();
    this.logger.info('Controllers initialization completed');

    this.logger.info('Init exception filters');
    await this._initExceptionFilters();
    this.logger.info('Exception filters initialization compleated');

    this.logger.info('Try to init server...');
    await this._initServer();
    this.logger.info(`🚀 Server started on ${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}`);
    this.server.get('/', (_req, res) => {
      res.send('Hello');
    });

  }
}
