import { Router } from 'express';
const cloudinary = require('cloudinary').v2;

const files = Router();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_APIKEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_APIKEY || !CLOUDINARY_API_SECRET) {
  const error = new Error('Invalid Cloudinary Error');
  error.message = 'cloudinary env value is missing.';
  throw error;
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_APIKEY,
  api_secret: CLOUDINARY_API_SECRET
});

files.post('/create-url', async (req, res) => {
  const { file } = req;
  if (!file) {
    return res.status(400).json({
      name: 'file',
      error: '파일이 존재하지 않습니다.'
    });
  }

  const filename = file.originalname.split('.')[0];
  try {
    const response = await cloudinary.uploader.upload(file.path, {
      public_id: `creatix/illust-image/veloss/${filename}`
    });

    if (!response || !response.secure_url) {
      res.status(400).json({
        name: 'file',
        error: '파일이 정상적으로 업로드되지 않았습니다'
      });
    }
    return res.status(200).json({
      file: {
        filename,
        url: response.secure_url,
        path: `creatix/illust-image/veloss/${filename}`
      }
    });
  } catch (e) {
    throw new Error(e);
  }
});

export default files;
