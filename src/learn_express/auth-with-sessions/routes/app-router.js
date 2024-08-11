import express from 'express';
import store from '../store.js';
import schemaValidator from '../middlewares/schema-validator.js';
import newUserSchema from '../schemas/new-user.js';
import { Template } from '../constants.js';
import alreadyRegister from '../middlewares/already-register.js';
import privateRoute from '../middlewares/private-route.js';
import userSchema from '../schemas/user.js';
import authenticate from '../middlewares/authenticate.js';

const appRouter = new express.Router();

// Это маршрут должен быть доступен только
// аутентифицированным пользователям
appRouter.get('/', privateRoute, async (req, res) => {
  const { username } = req.session;

  res.render('private', { username });
});

// Регистрация
appRouter.get('/register', async (_req, res) => {
  res.render('register');
});

// Обработка регистрационной формы
appRouter.post(
  '/register',
  [
    schemaValidator(newUserSchema, Template.REGISTER_PAGE),
    alreadyRegister(store),
  ],
  async (req, res) => {
    const { username, password } = req.body;

    await store.add(username, password);

    res.redirect('/login');
  }
);

// Вход на сайт
appRouter.get('/login', async (_req, res) => {
  res.render('login');
});

// Обработка формы «Вход»
appRouter.post(
  '/login',
  [schemaValidator(userSchema, Template.LOGIN_PAGE), authenticate(store)],
  async (_req, res) => {
    res.redirect('/');
  }
);

// Выход
appRouter.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

export default appRouter;
