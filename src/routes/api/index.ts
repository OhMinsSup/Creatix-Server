import Router from 'koa-router';
import v1 from './v1';

const api = new Router();

api.use('/v1', v1.routes());

export default api;
