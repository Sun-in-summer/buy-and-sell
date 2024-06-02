import express from 'express';

const app = express();

const port = 3000;

app.listen(port);

app.get('/', () => {
  throw new Error('Oops!');
});

// eslint-disable-next-line node/handle-callback-err, @typescript-eslint/no-unused-vars
app.use((_err, _req, res, next) => {
  res.status(500).send('Ой, что-то сломалось');
});
