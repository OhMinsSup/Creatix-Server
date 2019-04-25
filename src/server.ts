import dotenv from 'dotenv';
import { Options } from 'graphql-yoga';
import app from './app';
dotenv.config();

const PORT: number | string = process.env.PORT || 4000;
const GRAPHQL_ENDPOINT = '/graphql';
const PLAYGROUND_ENDPOINT = '/playground';
const SUBSCRIPTION_ENDPOINT: string = '/subscription';

interface ConnectionParamsType {
  access_token: string;
  refresh_token: string;
}

const appOptions: Options = {
  port: PORT,
  playground: PLAYGROUND_ENDPOINT,
  endpoint: GRAPHQL_ENDPOINT,
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:4000/graphql',
      'http://localhost:4000/playground'
    ],
    credentials: true
  },
  subscriptions: {
    path: SUBSCRIPTION_ENDPOINT,
    onConnect: async (connectionParams: ConnectionParamsType) => {}
  }
};

const handleListening = (): void => console.log(`Listening on http://localhost:${PORT} ✅`);
app.start(appOptions, handleListening);
