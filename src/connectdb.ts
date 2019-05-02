import { getConnectionOptions, createConnection } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();

export const createConnect = async (dropSchema: boolean = false) => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  return createConnection({ ...connectionOptions, name: 'default', dropSchema });
};

export const createConnectProd = async () => {
  const db = await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: true,
    synchronize: true,
    entities: [__dirname + '/entity/**/*.js']
  });
  return db;
};
