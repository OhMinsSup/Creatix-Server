import { Router } from 'express';
import auth from './auth';

const api = Router();

api.use('/auth', auth);

const router = Router();

router.use('/api/v1', api);

export default router;
