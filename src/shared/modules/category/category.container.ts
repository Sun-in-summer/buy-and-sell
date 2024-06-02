import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { CategoryServiceInterface } from './category-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultCategoryService } from './default-category.service.js';
import { CategoryEntity, CategoryModel } from './category.entity.js';
import { CategoryController } from './category.controller.js';
import { ControllerInterface } from '../../libs/rest/index.js';


export function createCategoryContainer() {
  const categoryContainer = new Container();
  categoryContainer.bind<CategoryServiceInterface>(Component.CategoryService).to(DefaultCategoryService);
  categoryContainer.bind<types.ModelType<CategoryEntity>>(Component.CategoryModel).toConstantValue(CategoryModel);
  categoryContainer.bind<ControllerInterface>(Component.CategoryController).to(CategoryController).inSingletonScope();

  return categoryContainer;

}
