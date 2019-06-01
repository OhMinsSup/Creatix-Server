import sharp from 'sharp';
import axios from 'axios';
import sizeOf from 'image-size';
import eTag from 'etag';
import { Router } from 'express';
import { checkUser } from '../../services/repository';
import authorized from '../../lib/middlewares/authorized';
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

files.post('/illust/create-url', authorized, async (req, res) => {
  interface BodySchema {
    userId: string;
  }

  const { file, body } = req;
  const { userId } = body as BodySchema;
  if (!file) {
    return res.status(400).json({
      ok: false,
      error: 'FILE_NOT_FOUND'
    });
  }

  try {
    const check = await checkUser(userId);
    if (!check) {
      return res.status(404).json({
        ok: false,
        error: 'USER_NOT_FOUND'
      });
    }

    const filename = file.originalname.split('.')[0];

    const response = await cloudinary.uploader.upload(file.path, {
      public_id: `creatix/illust-image/${userId}/${filename}`
    });

    if (!response || !response.secure_url) {
      res.status(400).json({
        ok: false,
        error: 'FILE_IS_NOT_UPLOAD_NORMALLY'
      });
    }

    return res.status(200).json({
      file: {
        filename,
        url: response.secure_url,
        path: `creatix/illust-image/${userId}/${file.originalname}`
      }
    });
  } catch (e) {
    throw new Error(e);
  }
});

files.post('/resize', async (req, res) => {
  interface BodySchema {
    url: string;
    width: number;
  }

  const { url, width } = req.body as BodySchema;
  if (!url || !width) {
    return res.status(400).json({
      ok: false,
      error: 'NO_BODY_DATA'
    });
  }

  if (isNaN(width)) {
    return res.status(400).json({
      ok: false,
      error: 'INVALID_WIDTH'
    });
  }

  try {
    const response = await axios.get(encodeURI(url), {
      responseType: 'arraybuffer'
    });

    const buffer = Buffer.from(response.data, 'binary');
    const size = await sizeOf(response.data);
    if (size.width <= width) {
      res.set({
        etag: response.headers['etag'],
        'Last-Modified': response.headers['last-modified'],
        'cache-control': 'max-age=604800'
      });
      const image = `data:image/png;base64,${buffer.toString('base64')}`;
      return res.status(200).json({ image });
    }

    const nextSize = {
      width,
      height: Math.round((width / size.width) * size.height)
    };

    const resized = await sharp(buffer)
      .resize(nextSize.width, nextSize.height)
      .toFormat('png')
      .toBuffer();

    const ETag = eTag(resized);
    res.set({
      ETag,
      'last-modified': response.headers['last-modified'],
      'cache-control': 'max-age=604800'
    });

    const image = `data:image/png;base64,${resized.toString('base64')}`;
    return res.status(200).json({ image });
  } catch (e) {
    throw new Error(e);
  }
});

export default files;
