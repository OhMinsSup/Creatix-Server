import Router from 'koa-router';
import * as authCtrl from './auth.ctrl';

const auth = new Router();

auth.post('/register/local', authCtrl.localRegister);
auth.post('/login/local', authCtrl.localLogin);
auth.post('/logout', authCtrl.logout);

auth.post('/sendEmail', authCtrl.sendEmail);
auth.get('/sendEmail/check/:code', authCtrl.checkCode);

auth.get('/exists/:key(email|username)/:value', authCtrl.checkExists);

export default auth;
