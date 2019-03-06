import Router from 'koa-router';
import * as localCtrl from './local.ctrl';
import * as socialCtrl from './social.ctrl';
import callback from './callback';

const auth = new Router();

auth.post('/register/local', localCtrl.localRegister);
auth.post('/login/local', localCtrl.localLogin);
auth.post('/logout', localCtrl.logout);

auth.post('/register/:provider(github|facebook|google|naver)/social', socialCtrl.socialRegister);

auth.post('/sendEmail', localCtrl.sendEmail);
auth.get('/sendEmail/check/:code', localCtrl.checkCode);
auth.get('/exists/:key(email|username)/:value', localCtrl.checkExists);

auth.use('/callback', callback.routes());

export default auth;
