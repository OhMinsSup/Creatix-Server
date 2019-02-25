import { Middleware, Context } from 'koa';
import axios from 'axios';
import crypto from 'crypto';
import { Response } from '../../../../../typings/common';

export const githubCallback: Middleware = async (ctx: Context) => {
  const { GITHUB_ID, GITHUB_SECRET } = process.env;

  try {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_ID,
        client_secret: GITHUB_SECRET,
        code: ctx.query.code
      },
      {
        headers: {
          accept: 'application/json'
        }
      }
    );

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    const hash = crypto.randomBytes(40).toString('hex');
    let nextUrl = `http://localhost:3000/callback?type=github&key=${hash}`;

    const { next } = ctx.query;

    if (next) {
      nextUrl += `&next=${next}`;
    }

    if (ctx.session !== null) {
      ctx.session.social_token = response.data.access_token;
    }

    ctx.redirect(encodeURI(nextUrl));
    ctx.body = {
      ok: true,
      error: null,
      payload: {
        social: response.data
      }
    } as Response<any>;
  } catch (error) {
    ctx.status = 401;
    let nextUrl = 'http://localhost:3000/callback?error=1';
    ctx.redirect(nextUrl);
  }
};

export const getToken: Middleware = (ctx: Context) => {
  try {
    if (ctx.session !== null) {
      const token: string = ctx.session.social_token;

      if (!token) {
        ctx.status = 400;
        ctx.body = {
          ok: false,
          error: {
            name: 'Social Token Error',
            message: '토큰이 존재하지 않습니다'
          },
          payload: null
        } as Response<any>;
        return;
      }

      ctx.body = {
        ok: true,
        error: null,
        payload: {
          token
        }
      } as Response<any>;
    }

    ctx.body = {
      ok: false,
      error: {
        name: 'Session Error',
        message: '세션이 없습니다.'
      },
      payload: null
    } as Response<any>;
  } catch (e) {
    ctx.throw(500, e);
  }
};
