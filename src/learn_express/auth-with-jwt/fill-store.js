import StoreService from './services/store-service.js';

(async () => {
  await StoreService.add('user@web.com', '123456');
  console.log('Добавлен тестовый пользователь user@web.com');
})();
