import express from 'express';

const PORT = 3000;

const companies = ['HTML Academy', 'Microsoft', 'Google'];
const comments = ['comment0', 'comment1', 'comment2'];

const app = express();

app.use(express.json());

app.use((req, _res, next) => {
  console.log(`Start request to url ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello , Express.js');
  console.log(req.query);
  console.log(`End request with status code ${res.statusCode}`);
  res.send(req.query);
});

app
  .listen(PORT, () => console.log(`Сервер запущен на порту: ${PORT}`))
  .on('error', (err) => {
    console.error(`Server can't start. Error: ${err}`);
  });

app.post('/company', (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

app.get('/company/:id', (req, res) => {
  const companyId = Number.parseInt(req.params.id, 10);

  if (!companies[companyId]) {
    return res.status(404).send('Not Found');
  }

  return res.send(companies[companyId]);
});

app.get('/company/:id/comment/:comId', (req, res) => {
  console.log(req.params);
  const companyId = Number.parseInt(req.params.id, 10);
  const commentId = Number.parseInt(req.params.comId, 10);

  if (!companies[companyId] || !comments[commentId]) {
    return res.status(404).send('Not Found');
  }

  return res.send(comments[commentId]);
});

app.use((_req, res) => {
  res.status(404).send('Page not found');
});
