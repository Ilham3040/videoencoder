import express from 'express';
import { uploadVideo } from './upload';
import { watchVideo } from './watch';
import { getAnimeNames,getEpisode } from './name';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

app.get('/anime', getAnimeNames);
app.get('/episode/:name' , getEpisode)
app.post('/upload', uploadVideo);
app.use('/watch', watchVideo);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
