import { DocumentType, types } from '@typegoose/typegoose';
import { CategoryService } from './category-service.interface.js';
import { CategoryEntity } from './category.entity.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { inject } from 'inversify';
import { Component } from '../../types/index.js';
import { LoggerInterface } from '../../libs/logger/logger.interface.js';


export class DefaultCategoryService implements CategoryService {
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
}
