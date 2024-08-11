import 'reflect-metadata';
import { Container } from 'inversify';
import RestApplication from './rest/rest-application.js';
import { Component } from './shared/types/component.enum.js';
import { createRestApplicationContainer } from './rest/rest.container.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/offer.container.js';
import { createCommentContainer } from './shared/modules/comment/comment.container.js';
import { createCategoryContainer } from './shared/modules/category/category.container.js';
import { createAuthContainer } from './shared/modules/auth/auth.container.js';


async function bootstrap () {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
    createCategoryContainer(),
    createAuthContainer(),
  );


  const application = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();

}

bootstrap();
