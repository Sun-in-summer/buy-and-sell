import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { CategoryServiceInterface } from './category-service.interface.js';
import { CategoryEntity } from './category.entity.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { Component, SortType } from '../../types/index.js';
import { LoggerInterface } from '../../libs/logger/logger.interface.js';
import { MAX_CATEGORIES_COUNT } from './category.constant.js';

@injectable()
export class DefaultCategoryService implements CategoryServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
@inject(Component.CategoryModel) private readonly categoryModel: types.ModelType<CategoryEntity>
  ) {}

  public async create(dto: CreateCategoryDto): Promise<DocumentType<CategoryEntity>> {
    const result = await this.categoryModel.create(dto);
    this.logger.info(`New category created: ${dto.name}`);
    return result;
  }

  public async findByCategoryId(categoryId: string): Promise<DocumentType<CategoryEntity> | null> {
    return this.categoryModel.findById(categoryId).exec();
  }

  public async findByCategoryName(categoryName: string): Promise<DocumentType<CategoryEntity> | null> {
    return this.categoryModel.findOne({name: categoryName}).exec();
  }

  public async findByCategoryNameOrCreate(categoryName: string, dto: CreateCategoryDto): Promise<DocumentType<CategoryEntity>> {
    const existedCategory = await this.findByCategoryName(categoryName);

    if (existedCategory) {
      return existedCategory;
    }

    return this.create(dto);
  }

  public async find(): Promise<DocumentType<CategoryEntity>[]> {
    return this.categoryModel
      .aggregate([
        {
          $lookup: {
            from: 'offers',
            let: { categoryId: '$_id'},
            pipeline: [
              { $match: { $expr: { $in: ['$$categoryId', '$categories'] } } },
              { $project: { _id: 1}}
            ],
            as: 'offers'
          },
        },
        { $addFields:
            { id: { $toString: '$_id'}, offerCount: { $size: '$offers'} }
        },
        { $unset: 'offers' },
        { $limit: MAX_CATEGORIES_COUNT },
        { $sort: { offerCount: SortType.Down } }
      ]).exec();
  }
}
