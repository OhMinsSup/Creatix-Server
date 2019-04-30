import dotenv from 'dotenv';
import { GraphQLServer } from 'graphql-yoga';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import compresion from 'compression';
import schema from './schema';
import { createConnect } from './lib/connectdb';
import { consumeUser } from './lib/token';
dotenv.config();

class App {
  public app: GraphQLServer;
  constructor() {
    this.app = new GraphQLServer({
      schema,
      context: contextParams => {
        return {
          req: contextParams.request,
          res: contextParams.response
        };
      }
    });
    this.initiallizeDB();
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
    express.use(
      cors({
        origin: [
          'http://localhost:3000',
          'http://localhost:4000/graphql',
          'http://localhost:4000/playground'
        ],
        credentials: true
      })
    );

    if (process.env.NODE_ENV === 'development') {
      express.use(logger('dev'));
    }

    express.use(helmet());
    express.use(cookieParser());
    express.use(consumeUser);
  };

  private initiallizeDB() {
    createConnect()
      .then(() => {
        console.log(`${process.env.NODE_ENV} Creatix Database Conntection ✅`);
        console.log(`${process.env.NODE_ENV} Postgres RDBMS connection is established ✅`);
      })
      .catch(error => console.log(error));
  }
}

export default new App().app;
