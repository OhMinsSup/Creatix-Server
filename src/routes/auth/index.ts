import { Router } from 'express';
import callback from './callback';

const auth = Router();

auth.use('/callback', callback);

export default auth;
