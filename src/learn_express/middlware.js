import express from 'express';

const app = express();

const port = 3000;
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} — ${new Date().toLocaleTimeString()}`);
  next();
});

app.use((req, res, next) => {
  if (req.path === '/') {
    res.send('Hello');
  }
  next();
});

app.use((req, res, next) => {
  if (req.path === '/keks') {
    // eslint-disable-next-line quotes
    res.send("Hello. I'am Keks");
  }
  next();
});

app.get('/:id', (req, res, next) => {
  const id = +req.params.id;
  if (id === 100) {
    res.send('Hey, superhero!');
  } else {
    // eslint-disable-next-line node/callback-return
    next();
  }
});

app.get('/:id', (req, res) => {
  const { id } = req.params;
  res.send(`Your id === ${id}`);
});

app.listen(port);
