export const isDevClient =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'd2yl9hrj3znjnh.cloudfront.net';

export const isDevServer =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000/graphql'
    : 'https://creatix-api-server.herokuapp.com/graphql';

export const isPlayground = 'http://localhost:4000/playground';
