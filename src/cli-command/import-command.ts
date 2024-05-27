import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './cli-command.interface.js';
import {createOffer, getErrorMessage} from '../utils/common.js';
import { UserService } from '../shared/modules/user/user-service.interface.js';
import { CategoryModel, CategoryService, DefaultCategoryService } from '../shared/modules/category/index.js';
import { OfferService, OfferModel, DefaultOfferService} from '../shared/modules/offer/index.js';
import { LoggerInterface } from '../shared/libs/logger/index.js';
import { MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { PinoLogger } from '../shared/libs/logger/pino.logger.js';
import { DefaultUserService, UserModel } from '../shared/modules/user/index.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from '../cli/commands/command.constant.js';
import { Offer } from '../shared/types/index.js';
import { getMongoURI } from '../shared/helpers/index.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userService: UserService;
  private categoryService: CategoryService;
  private offerService: OfferService;
  private databaseClient: MongoDatabaseClient;
  private logger: LoggerInterface;
  private salt!: string;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new PinoLogger();
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.categoryService = new DefaultCategoryService(this.logger, CategoryModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }


  private async onLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onComplete(count: number) {
    console.log(`${count} rows imported.`);
    this.databaseClient.disconnect();
  }

  private async saveOffer(offer: Offer) {
    const categories: string[] = [];
    const user = await this.userService.findOrCreate({
      ...offer.user,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    for (const { name } of offer.categories) {
      const existCategory = await this.categoryService.findByCategoryNameOrCreate(name, { name });
      categories.push(existCategory.id);
    }

    await this.offerService.create({
      categories,
      userId: user.id,
      title: offer.title,
      description: offer.description,
      image: offer.image,
      postDate: offer.postDate,
      price: offer.price,
      type: offer.type,
    });

  }


  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {

    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    console.info(uri);
    this.salt = salt;
    await this.databaseClient.connect(uri);


    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);


    try {
      fileReader.read();
      console.log(fileReader.read());
    } catch (err) {

      console.log(`Can't read the file: ${getErrorMessage(err)}`);
    }
  }
}
