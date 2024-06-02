import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import multer from 'multer';

const app = express();

// инициализируем хранилище
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const imageExtensions = ['.jpg', '.png', '.svg'];
    const extension = path.extname(file.originalname);
    // Важно! Директории должны существовать
    const uploadPath = imageExtensions.includes(extension)
      ? 'uploadStorage/images'
      : 'uploadStorage';
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Подготовим уникальное имя для файла
    // eslint-disable-next-line prefer-template
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueName}${extension}`);
  },
});

// инициализируем multer
const upload = multer({
  dest: 'upload/',
  fileFilter: (req, file, cb) => {
    // объект file содержит ту же информацию о файле,
    // что и req.file в предыдущем примере
    const extension = path.extname(file.originalname);
    console.log(extension);

    // колбэк Node-style. Первый аргумент — ошибка,
    // второй — логическое значение, следует ли обрабатывать файл
    cb(null, extension === '.png');
  },
  storage: diskStorage,
});

// инициализируем middleware для обработки единственного поля с именем “avatar”
// const avatarUpload = upload.single('avatar');
// const fileInputUpload = upload.array('photos', 2);
const manyDifferentFilesUpload = upload.fields([
  { name: 'file-input', maxCount: 1 },
  { name: 'another-file-input', maxCount: 1 },
]);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'static')));

// мы хотим, чтобы загруженные файлы были доступны извне, однако класть их в /static неправильно
app.use(express.static(path.join(__dirname, 'upload')));

// get
const getContent = () => `<!doctype html>
  <html lang="ru">
    <head>
      <title>Hello, world</title>
      <style>
        form {
          display: flex;
          justify-content: center;
          flex-grow: 1;
          flex-direction: column;
          width: 500px;
        }

        label {
          font-weight: bold;
          margin-bottom: 2px;
          display: block;
        }

        input {
          border: 1px solid #ccc;
          margin: 3px 0;
          padding: 5px;
        }

        button {
          width: 100px;
          margin-top: 10px;
        }
        </style>
    </head>
    <body>
      <form enctype="multipart/form-data" action="/" method="post">
  <input type="text" name="username">
  <input type="file" name="file-input">
   <input type="file" name="another-file-input">
  <input type="submit">
</form>
    </body>
`;

app.get('/', (_req, res) => {
  res.send(getContent());
});

// добавляем middleware в цепочку обработчиков
app.post('/', manyDifferentFilesUpload, (req, res) => {
  console.log(req.files);
  res.send('OK');
});

app.listen(3000);
