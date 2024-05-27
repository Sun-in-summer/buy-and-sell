import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { CategoryService } from './category-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultCategoryService } from './default-category.service.js';
import { CategoryEntity, CategoryModel } from './category.entity.js';


export function createCategoryContainer() {
  const categoryContainer = new Container();
  categoryContainer.bind<CategoryService>(Component.CategoryService).to(DefaultCategoryService);
  categoryContainer.bind<types.ModelType<CategoryEntity>>(Component.CategoryModel).toConstantValue(CategoryModel);

  return categoryContainer;

}
