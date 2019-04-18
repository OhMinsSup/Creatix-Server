import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
dotenv.config();

const { SECRET_KEY } = process.env;

if (!SECRET_KEY) {
  const error = new Error('InvalidSecretKeyError');
  error.message = 'Secret key for JWT is missing.';
  if (process.env.npm_lifecycle_event !== 'typeorm') throw error;
}

export const generateToken = (payload: any, options?: jwt.SignOptions): Promise<string> => {
  const jwtOptions: jwt.SignOptions = {
    issuer: 'creatix',
    expiresIn: '7d',
    ...options
  };
  if (!jwtOptions.expiresIn) {
    delete jwtOptions.expiresIn;
  }
  return new Promise((resolve, reject) => {
    if (!SECRET_KEY) return;
    jwt.sign(payload, SECRET_KEY, jwtOptions, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

export const decodeToken = <T = any>(token: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    if (!SECRET_KEY) return;
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded as any);
    });
  });
};

export function setTokenCookie(
  res: Response,
  tokens: { accessToken: string; refreshToken: string }
) {
  res.cookie('access_token', tokens.accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60
  });
  res.cookie('refresh_token', tokens.accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30
  });
}
