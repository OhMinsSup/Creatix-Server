import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { GenerateToken, DecodedToken, RefreshTokenData } from '../typings/token';
import { Context } from 'koa';
import { getRepository } from 'typeorm';
import User from '../database/entity/User';
dotenv.config();

const { SECRET_KEY } = process.env;

if (!SECRET_KEY) {
  const error = new Error('InvalidSecretKeyError');
  error.message = 'Secret key for JWT is missing.';
  if (process.env.npm_lifecycle_event !== 'typeorm') throw error;
}

/**
 * @description JWT 토큰 생성
 * @param {GenerateToken<G>} payload
 * @param {SignOptions?} options
 * @returns {Promise<string>} token
 */
export const generateToken = <G = any>(
  payload: GenerateToken<G>,
  options?: SignOptions
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const jwtOptions: SignOptions = {
      ...options
    };
    jwt.sign(
      payload as string | object | Buffer,
      SECRET_KEY as string,
      jwtOptions,
      (err, token) => {
        if (err instanceof Error === true) {
          reject(err);
        }
        resolve(token);
      }
    );
  });
};

/**
 * @description JWT 토큰에서 유저 decoded
 * @param {string} token
 * @returns {Promise<D>} User
 */
export const decodedToken = <D = any>(token: string): Promise<D> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY as string, (err, decoded: DecodedToken<D>) => {
      if (err instanceof Error === true) {
        reject(err);
      }
      resolve(decoded);
    });
  });
};

/**
 * @description refreshToken 재발급
 * @param {Context} ctx
 * @param {string} refreshToken
 * @returns {Promise<string>} User
 */
export const refresh = async (ctx: Context, refreshToken: string) => {
  try {
    const decoded = await decodedToken<RefreshTokenData>(refreshToken);
    const user = await getRepository(User).findOne(decoded.user_id);
    if (!user) {
      const error = new Error('InvalidUserError');
      throw error;
    }
    const tokens = await user.refreshUserToken(decoded.token_id, decoded.exp, refreshToken);
    setTokenCookie(ctx, tokens);
    return decoded.user_id;
  } catch (e) {
    throw e;
  }
};

/**
 * @description cookies에 accessToken & refreshToken을 전달
 * @param {Context} ctx
 * @param {object} tokens { accessToken, refreshToken }
 * @returns {Promise<string>} User
 */
export const setTokenCookie = (
  ctx: Context,
  tokens: { accessToken: string; refreshToken: string }
) => {
  // set cookie
  ctx.cookies.set('access_token', tokens.accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60
  });

  ctx.cookies.set('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30
  });
};
