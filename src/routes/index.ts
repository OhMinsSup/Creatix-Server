import { Router } from 'express';
import callback from './callback';
import files from './files';

const api = Router();

api.use('/callback', callback);
api.use('/files', files);

const router = Router();

router.use('/api/v1', api);

export default router;
