import dotenv from 'dotenv';
import { GraphQLServer } from 'graphql-yoga';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import compresion from 'compression';
import schema from './schema';
import { createDevConnection } from './lib/utils';
dotenv.config();

class App {
  public app: GraphQLServer;
  constructor() {
    this.app = new GraphQLServer({
      schema,
      context: req => {
        const { connection: { context = null } = {} } = req;
        return {
          res: req.response,
          req: req.request,
          context
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
    express.use(cors());
    express.use(logger('dev'));
    express.use(helmet());
    express.use(cookieParser());
  };

  private initiallizeDB() {
    createDevConnection()
      .then(() => {
        console.log('Creatix Database Conntection ✅');
        console.log('Postgres RDBMS connection is established ✅');
      })
      .catch(error => console.log(error));
  }
}

export default new App().app;
