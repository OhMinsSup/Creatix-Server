import Koa from 'koa';
import helmet from 'koa-helmet';
import morgan from 'koa-morgan';
import compress from 'koa-compress';
import body from 'koa-body';
import routes from './routes';
import database from './database/db';

class Server {
  public app: Koa;

  constructor() {
    this.app = new Koa();
    this.initializeDb();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    const { app } = this;

    app.use(
      body({
        multipart: true,
        formidable: {
          keepExtensions: true
        }
      })
    );
    app.use(
      compress({
        filter: contentType => {
          return /text/i.test(contentType);
        },
        threshold: 2048,
        flush: require('zlib').Z_SYNC_FLUSH
      })
    );
    app.use(morgan('dev'));
    app.use(helmet());
  }
  
  private async initializeDb(): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      await database.connectTest();
    } else {
      if (!database.connected) {
        await database.connect();
      }
    }
  }
  
  private routes(): void {
    const { app } = this;
    app.use(routes.routes()).use(routes.allowedMethods());
  }
}

export default new Server().app;
