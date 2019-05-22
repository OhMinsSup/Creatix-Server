import './env';
import { Options } from 'graphql-yoga';
import app from './app';
import { isDevClient, isDevServer, isPlayground } from './lib/utils';

const PORT: number | string = process.env.PORT || 4000;
const GRAPHQL_ENDPOINT = '/graphql';
const PLAYGROUND_ENDPOINT = '/playground';
// const SUBSCRIPTION_ENDPOINT: string = '/subscription';

/*
interface ConnectionParams {
  access_token: string;
  refresh_token: string;
}
*/
const appOptions: Options = {
  port: PORT,
  playground: PLAYGROUND_ENDPOINT,
  endpoint: GRAPHQL_ENDPOINT,
  cors: {
    origin: [isDevClient, isDevServer, isPlayground],
    credentials: true
  }
  //  subscriptions: {
  //    path: SUBSCRIPTION_ENDPOINT,
  //    onConnect: async (connectionParams: ConnectionParams) => {}
  //  }
};

const handleListening = (): void =>
  console.log(`${process.env.NODE_ENV} Listening on http://localhost:${PORT} ✅`);
app.start(appOptions, handleListening);
