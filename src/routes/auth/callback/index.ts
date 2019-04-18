import { Router } from 'express';
import * as callbackCtrl from './callback.ctrl';

const callback = Router();

callback.get('/google/login', callbackCtrl.redirectGoogleLogin);
callback.get('/google', callbackCtrl.googleCallback);

export default callback;
