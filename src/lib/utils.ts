import crypto from 'crypto';

export const hash = (password: string): string => {
  return crypto
    .createHmac('sha256', '12#2!2@ride$key$vlaue')
    .update(password)
    .digest('hex');
};

export const normalizePort = (val: number | string): number | string | boolean => {
  const port: number = typeof val === 'string' ? parseInt(val, 10) : val;
  if (isNaN(port)) {
    return val;
  } else if (port >= 0) {
    return port;
  } else {
    return false;
  }
};
