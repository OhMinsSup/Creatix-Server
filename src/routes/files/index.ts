import { Router } from 'express';
import * as filesCtrl from './files.ctrl';

const files = Router();

files.post('/', filesCtrl.createIllustImageUrl);

export default files;
