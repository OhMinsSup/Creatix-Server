import { Middleware, Context } from 'koa';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import axios from 'axios';
import crypto from 'crypto';
import qs from 'qs';
import { Response } from '../../../../../typings/common';
import {
  RedirectProviderLoginQuerySchema,
  ProviderCallbackQuerySchema
} from '../../../../../typings/auth';
dotenv.config();

const {
  GOOGLE_ID,
  GOOGLE_SECRET,
  FACEBOOK_ID,
  FACEBOOK_SECRET,
  GITHUB_ID,
  GITHUB_SECRET
} = process.env;

if (!GOOGLE_ID || !GOOGLE_SECRET) {
  const error = new Error('InvalidGoogleEnvError');
  error.message = 'GoogleEnv is missing.';
  throw error;
}

if (!FACEBOOK_ID || !FACEBOOK_SECRET) {
  const error = new Error('InvalidFacebookEnvError');
  error.message = 'FacebookEnv is missing.';
  throw error;
}

if (!GITHUB_ID || !GITHUB_SECRET) {
  const error = new Error('InvalidGithubEnvError');
  error.message = 'GithubEnv is missing.';
  throw error;
}

/**
 * Redirect Google Auth Login API
 *
 * GET api/v1/auth/callback/google/login
 *
 * @param {Context} ctx A Koa Context encapsulates node's request and response objects into a single object which provides many helpful methods for writing web applications and APIs.
 * @returns {compose.Middleware<ParameterizedContext<any, {}>>} Return as Promise type compose.Middleware type
 */
export const redirectGoogleLogin: Middleware = (ctx: Context) => {
  const { next } = ctx.query as RedirectProviderLoginQuerySchema;
  const callbackUrl = 'http://localhost:6000/api/v1/auth/callback/google';
  const oauth2Client = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, callbackUrl);

  const url = oauth2Client.generateAuthUrl({
    scope: ['https://www.googleapis.com/auth/userinfo.email'],
    state: JSON.stringify({ next: next || '/' })
  });
  ctx.redirect(url);
};

/**
 * Google Auth Callback API
 *
 * GET api/v1/auth/callback/google
 *
 * @param {Context} ctx A Koa Context encapsulates node's request and response objects into a single object which provides many helpful methods for writing web applications and APIs.
 * @returns {compose.Middleware<ParameterizedContext<any, {}>>} Return as Promise type compose.Middleware type
 */
export const googleCallback: Middleware = async (ctx: Context) => {
  const { code, state } = ctx.query as ProviderCallbackQuerySchema;
  const callbackUrl = 'http://localhost:6000/api/v1/auth/callback/google';
  if (!code) {
    ctx.redirect(`http://localhost:3000/?callback?error=1`);
    return;
  }

  const oauth2Client = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, callbackUrl);
  try {
    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens) {
      ctx.status = 401;
      return;
    }

    const { access_token } = tokens;
    if (!access_token) {
      ctx.status = 401;
      return;
    }

    const hash = crypto.randomBytes(40).toString('hex');
    let nextUrl = `http://localhost:3000/callback?type=google&key=${hash}`;
    if (state) {
      const { next } = JSON.parse(state);
      nextUrl += `&next=${next}`;
    }

    if (!ctx.session) {
      ctx.status = 401;
      return;
    }

    ctx.session.social_token = access_token;
    ctx.redirect(encodeURI(nextUrl));
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**
 * Redirect Facebook Auth Login API
 *
 * GET api/v1/auth/callback/facebook/login
 *
 * @param {Context} ctx A Koa Context encapsulates node's request and response objects into a single object which provides many helpful methods for writing web applications and APIs.
 * @returns {compose.Middleware<ParameterizedContext<any, {}>>} Return as Promise type compose.Middleware type
 */
export const redirectFacebookLogin: Middleware = (ctx: Context) => {
  const { next } = ctx.query as RedirectProviderLoginQuerySchema;

  const state = JSON.stringify({ next: next || '/' });
  const callbackUrl = 'http://localhost:6000/api/v1/auth/callback/facebook';
  const authUrl = `https://www.facebook.com/v3.2/dialog/oauth?client_id=${FACEBOOK_ID}&redirect_uri=${callbackUrl}&state=${state}&scope=email,public_profile`;
  ctx.redirect(encodeURI(authUrl));
};

/**
 * Facebook Auth Callback API
 *
 * GET api/v1/auth/callback/facebook
 *
 * @param {Context} ctx A Koa Context encapsulates node's request and response objects into a single object which provides many helpful methods for writing web applications and APIs.
 * @returns {compose.Middleware<ParameterizedContext<any, {}>>} Return as Promise type compose.Middleware type
 */
export const facebookCallback: Middleware = async (ctx: Context) => {
  const { code, state } = ctx.query as ProviderCallbackQuerySchema;
  const callbackUrl = 'http://localhost:6000/api/v1/auth/callback/facebook';
  if (!code) {
    ctx.redirect(`http://localhost:4000/?callback?error=1`);
    return;
  }

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v3.2/oauth/access_token?${qs.stringify({
        client_id: FACEBOOK_ID,
        redirect_uri: callbackUrl,
        client_secret: FACEBOOK_SECRET,
        code
      })}`
    );

    const { access_token } = response.data;
    if (!access_token) {
      ctx.redirect(`http://localhost:3000/?callback?error=1`);
      return;
    }

    const hash = crypto.randomBytes(40).toString('hex');
    let nextUrl = `http://localhost:3000/callback?type=facebook&key=${hash}`;

    if (state) {
      const { next } = JSON.parse(state);
      nextUrl += `&next=${next}`;
    }

    if (!ctx.session) {
      ctx.status = 401;
      return;
    }

    ctx.session.social_token = access_token;
    ctx.redirect(encodeURI(nextUrl));
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**
 * Github Auth Callback & Login API
 *
 * GET api/v1/auth/callback/github
 *
 * @param {Context} ctx A Koa Context encapsulates node's request and response objects into a single object which provides many helpful methods for writing web applications and APIs.
 * @returns {compose.Middleware<ParameterizedContext<any, {}>>} Return as Promise type compose.Middleware type
 */
export const githubCallback: Middleware = async (ctx: Context) => {
  try {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_ID,
        client_secret: GITHUB_SECRET,
        code: ctx.query.code as string
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

    if (!ctx.session) {
      ctx.status = 401;
      return;
    }

    ctx.session.social_token = response.data.access_token;
    ctx.redirect(encodeURI(nextUrl));

    ctx.body = {
      ok: true,
      error: null,
      payload: {
        social: response.data
      }
    } as Response<{ social: any }>;
  } catch (error) {
    ctx.status = 401;
    let nextUrl = 'http://localhost:3000/callback?error=1';
    ctx.redirect(nextUrl);
  }
};

/**
 * get accessToken API
 *
 * GET api/v1/auth/callback/token
 *
 * @param {Context} ctx A Koa Context encapsulates node's request and response objects into a single object which provides many helpful methods for writing web applications and APIs.
 * @returns {compose.Middleware<ParameterizedContext<any, {}>>} Return as Promise type compose.Middleware type
 */
export const getToken: Middleware = (ctx: Context) => {
  try {
    if (ctx.session !== null) {
      const token: string = ctx.session.social_token;

      if (!token) {
        ctx.status = 401;
        ctx.body = {
          ok: false,
          error: {
            name: 'Social Token Error',
            message: '토큰이 존재하지 않습니다'
          },
          payload: null
        } as Response;
        return;
      }

      ctx.body = {
        ok: true,
        error: null,
        payload: {
          token
        }
      } as Response<{
        token: string;
      }>;
      return;
    }

    ctx.status = 401;
    ctx.body = {
      ok: false,
      error: {
        name: 'Session Error',
        message: '세션이 없습니다.'
      },
      payload: null
    } as Response;
  } catch (e) {
    ctx.throw(500, e);
  }
};
