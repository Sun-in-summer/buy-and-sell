import { inject, injectable } from 'inversify';
import { ConfigInterface , RestSchema } from '../shared/libs/config/index.js';
import {LoggerInterface} from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/component.enum.js';
import { MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/database.js';
import { UserModel } from '../shared/modules/user/user.entity.js';


@injectable()
export default class RestApplication {


  constructor(
    @inject(Component.LoggerInterface)private readonly logger: LoggerInterface,
    @inject(Component.ConfigInterface)private readonly config: ConfigInterface<RestSchema>,
    @inject(Component.MongoDatabaseClient)private readonly databaseClient: MongoDatabaseClient,
  ) {

  }

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),

    );

    this.databaseClient.connect(mongoUri);


    const user = await UserModel.create({
      email: 'test@email.local',
      avatarPath: 'keks.jpg',
      firstname: 'Keks',
      lastname: 'Unknown'
    });

    const error = user.validateSync();
    console.log(error);


    return user ;
  }

  public async init() {
    this.logger.info('REST Application initialization...');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
    this.logger.info('Init database');
    await this._initDb();
    this.logger.info('Init database completed');
  }
}
