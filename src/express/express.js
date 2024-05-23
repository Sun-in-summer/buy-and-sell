import express from 'express';

const PORT = 3000;

const app = express();

app.use((req, _res, next) => {
  console.log(`Start request to url ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello , Express.js');
  console.log(`End request with status code ${res.statusCode}`);
});

app.use((_req, res) => {
  res.status(404).send('Page not found');
});

app
  .listen(PORT, () => console.log(`Сервер запущен на порту: ${PORT}`))
  .on('error', (err) => {
    console.error(`Server can't start. Error: ${err}`);
  });
