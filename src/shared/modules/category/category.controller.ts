import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../libs/logger/logger.interface.js';
import { BaseController, HttpError, HttpMethod, PrivateRouteMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Request, Response } from 'express';
import { CategoryServiceInterface } from './category-service.interface.js';
import { fillDTO } from '../../helpers/common.js';
import { CategoryRdo } from './rdo/category.rdo.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { StatusCodes } from 'http-status-codes';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import { OfferRdo } from '../offer/index.js';
import { ParamCategoryId } from './type/param-categoryId.type.js';
import { RequestQuery } from '../../libs/rest/types/request-query.type.js';
import { ValidateDtoMiddleware } from '../../libs/rest/middleware/validate-dto.middleware.js';


@injectable()
export class CategoryController extends BaseController{

  constructor(
    @inject(Component.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(Component.CategoryService) private readonly categoryService: CategoryServiceInterface,
    @inject(Component.OfferService) private readonly offerService: OfferServiceInterface,
  ){
    super(logger);

    this.logger.info('Register routes for CategoryController...');
    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCategoryDto)
      ]});
    this.addRoute({
      path: '/:categoryId/offers',
      method: HttpMethod.Get,
      handler: this.getOffersFromCategory,
      middlewares: [
        new ValidateObjectIdMiddleware('categoryId')
      ] });

  }

  public async index(_req: Request, res: Response): Promise<void> {
    const categories = await this.categoryService.find();
    const responseData = fillDTO(CategoryRdo, categories);
    this.ok(res, responseData);
  }

  public async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateCategoryDto>, res: Response): Promise<void> {
    const existCategory = await this.categoryService.findByCategoryName(body.name);

    if (existCategory) {
      throw new HttpError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Category with name «${body.name}» exists.`,
        'Category Controller');

    }

    const result = await this.categoryService.create(body);
    this.created(res, fillDTO(CategoryRdo, result));
  }

  public async getOffersFromCategory(
    { params, query } : Request<ParamCategoryId, unknown, unknown, RequestQuery>,
    res: Response,
  ):Promise<void> {
    const offers = await this.offerService.findByCategoryId(params.categoryId, query.limit);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

}
