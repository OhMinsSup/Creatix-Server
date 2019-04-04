import { GraphQLServer } from 'graphql-yoga';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import compresion from 'compression';
import schema from './schema';

class App {
  public app: GraphQLServer;
  constructor() {
    this.app = new GraphQLServer({
      schema
    });
    this.middlewares();
  }

  private middlewares = (): void => {
    const {
      app: { express }
    } = this;
    express.use(
      compresion({
        level: 6
      })
    );
    express.use(cors());
    express.use(logger('dev'));
    express.use(helmet());
    express.use(cookieParser());
  };
}

export default new App().app;
