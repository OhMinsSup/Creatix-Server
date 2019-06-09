import { Router } from 'express';

const callback = Router();

callback.get('/naver', () => {});

callback.get('/github', () => {});

callback.get('/google', () => {});
callback.get('/google/login', () => {});

callback.get('/facebook', () => {});
callback.get('/facebook/login', () => {});

callback.post('/token', () => {});

export default callback;
