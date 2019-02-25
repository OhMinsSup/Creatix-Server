import { Context } from 'koa';
import { AccessTokenData } from '../../typings/token';
import { decodedToken, refresh } from '../token';

/**
 * @description JWT 미들웨어
 * @param {Context} ctx
 * @returns {Promise<void>}
 */
export const jwt = async (ctx: Context) => {
  // cookies에 있는 데이터를 가져온다
  const accessToken: string | undefined = ctx.cookies.get('access_token');
  const refreshToken: string | undefined = ctx.cookies.get('refresh_token');

  if (!accessToken) {
    ctx.state.user_id = null;
    return;
  }

  try {
    // decoded
    const accessTokenData = await decodedToken<AccessTokenData>(accessToken);
    ctx.state.user_id = accessTokenData.user_id;
    // refresh token when life < 30mins
    const diff = accessTokenData.exp * 1000 - new Date().getTime();
    if (diff < 1000 * 60 * 30 && refreshToken) {
      await refresh(ctx, refreshToken);
    }
  } catch (e) {
    // invalid token! try token refresh...
    if (!refreshToken) return;
    try {
      const userId = await refresh(ctx, refreshToken);
      // set user_id if succeeds
      ctx.state.user_id = userId;
    } catch (e) {}
  }
};
