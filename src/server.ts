import dotenv from 'dotenv';
import { Options } from 'graphql-yoga';
import { createConnection } from 'typeorm';
import app from './app';
dotenv.config();

const PORT: number | string = process.env.PORT || 4000;
const GRAPHQL_ENDPOINT = '/graphql';
// const SUBSCRIPTIONS_ENDPOINT = '/subscriptions';
const PLAYGROUND_ENDPOINT = '/playground';

const appOptions: Options = {
  port: PORT,
  playground: PLAYGROUND_ENDPOINT,
  endpoint: GRAPHQL_ENDPOINT
};

const handleListening = (): void => console.log(`Listening on http://localhost:${PORT} ✅`);

createConnection()
  .then(() => {
    console.log('Creatix Database Conntection ✅');
    console.log('Postgres RDBMS connection is established ✅');
    app.start(appOptions, handleListening);
  })
  .catch(error => console.log(error));
