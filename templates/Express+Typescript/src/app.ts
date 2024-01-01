import express from 'express';
import path from 'path';
import router from './routes/route';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});