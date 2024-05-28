import { Request, Response } from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Create the uploadVideo handler
export const uploadVideo = (req: Request, res: Response) => {
  upload.single('video')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(500).send(err.message);
    }

    const videoFile = req.file;
    const videoName = req.body.videoname;

    if (!videoFile || !videoName) {
      return res.status(400).send('Video file and video name are required');
    }

    // Log the video file path
    console.log('Uploaded file path:', videoFile.path);

    // Ensure correct file path for saving and processing
    const outputDir = path.join(__dirname, '../collections/', videoName, '/');
    const outputPath = path.join(outputDir, 'manifest.mpd');

    // Create the output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Use correct file path for encoding
    ffmpeg(videoFile.path)
      .outputOptions([
        '-preset fast',
        '-g 48',
        '-keyint_min 48',
        '-sc_threshold 0',
        '-b_strategy 0',
        '-bf 3',
        '-b_ref_mode middle',
        '-b:v 2500k', // Increase the bitrate for HD
        '-s 1280x720', // Set resolution to HD
        '-r 30',
        '-use_timeline 1',
        '-use_template 1',
        '-init_seg_name init-$RepresentationID$.mp4',
        '-media_seg_name chunk-$RepresentationID$-$Number$.m4s',
        '-f dash',
      ])
      .output(outputPath)
      .on('end', () => {
        console.log('Encoding finished. Cleaning up uploaded file.');
        fs.unlinkSync(videoFile.path); // Delete the uploaded video file
        res.status(200).send('Video uploaded and encoded successfully');
      })
      .on('error', (err) => {
        console.error('Error encoding video:', err);
        res.status(500).send('Error encoding video');
      })
      .run();
  });
};
