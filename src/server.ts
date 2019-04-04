import dotenv from 'dotenv';
import { Options } from 'graphql-yoga';
import app from './app';
dotenv.config();

const PORT: number | string = process.env.PORT || 4000;
const GRAPHQL_ENDPOINT = '/graphql';
const PLAYGROUND_ENDPOINT = '/playground';

const appOptions: Options = {
  port: PORT,
  playground: PLAYGROUND_ENDPOINT,
  endpoint: GRAPHQL_ENDPOINT
};

const handleListening = (): void => console.log(`Listening on http://localhost:${PORT} ✅`);
app.start(appOptions, handleListening);
