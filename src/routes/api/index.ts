import { Router } from 'express';
import multer from 'multer';
import files from './files';
import callback from './callback';

const api = Router();
const storage = multer.diskStorage({});
const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/jpe|jpeg|png|gif$i/)) {
      callback(new Error('File is not supported'), false);
      return;
    }
    return callback(null, true);
  },
  storage
}).single('image');

api.use('/files', upload, files);
api.use('/callback', callback);

export default api;
