import express from 'express';
import expressSession from 'express-session';
import router from './routes/app-router.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 4000;
const SECRET = 'keks31337';

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(
  expressSession({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'session_id',
  })
);

app.use(express.urlencoded({ extended: false }));

app.use('/', router);

app.listen(PORT);
