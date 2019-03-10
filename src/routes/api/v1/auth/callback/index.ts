import Router from 'koa-router';
import * as callbackCtrl from './callback.ctrl';

const callback = new Router();

callback.get('/google/login', callbackCtrl.redirectGoogleLogin);
callback.get('/google', callbackCtrl.googleCallback);

callback.get('/facebook/login', callbackCtrl.redirectFacebookLogin);
callback.get('/facebook', callbackCtrl.facebookCallback);

callback.get('/naver/login', callbackCtrl.redirectNaverLogin);
callback.get('/naver', callbackCtrl.naverCallback);

callback.get('/github', callbackCtrl.githubCallback);

callback.post('/token', callbackCtrl.getToken);

export default callback;
