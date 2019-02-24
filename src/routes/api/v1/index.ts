import Router from 'koa-router';
import auth from './auth';

const v1 = new Router();

v1.use('/auth', auth.routes());

v1.get('/version/check', ctx => {
  ctx.body = 'v1';
});

export default v1;
