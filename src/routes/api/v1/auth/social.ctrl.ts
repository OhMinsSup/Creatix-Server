import { Middleware, Context } from 'koa';

export const socialRegister: Middleware = async (ctx: Context) => {
  ctx.body = 'social';
};

export const socialLogin: Middleware = async (ctx: Context) => {
  ctx.body = 'login';
};

export const verifySocial: Middleware = async (ctx: Context) => {
  ctx.body = 'verfiy';
};
