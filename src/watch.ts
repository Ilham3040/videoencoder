import { Request, Response, Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

router.get('/:videoname/:filename', (req: Request, res: Response) => {
  const videoname = req.params.videoname;
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../collections', videoname, filename);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

export { router as watchVideo };
