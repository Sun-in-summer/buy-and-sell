import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { Component } from '../../types/index.js';
import { CommentEntity, CommentModel, CommentServiceInterface, DefaultCommentService } from './index.js';
import { ControllerInterface } from '../../libs/rest/index.js';
import { CommentController } from './comment.controller.js';


export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer.bind<CommentServiceInterface>(Component.CommentService)
    .to(DefaultCommentService)
    .inSingletonScope();

  commentContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel)
    .toConstantValue(CommentModel);

  commentContainer.bind<ControllerInterface>(Component.CommentController).to(CommentController).inSingletonScope();

  return commentContainer;
}
