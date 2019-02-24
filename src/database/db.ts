import { createConnection, Connection } from 'typeorm';
import pg from 'pg';
import dotenv from 'dotenv';
import 'reflect-metadata';
dotenv.config();

(pg as any).defaults.parseInt8 = true;

const { TYPEORM_DATABASE, TYPEORM_PASSWORD, TYPEORM_USERNAME, TYPEORM_HOST } = process.env;

export const createTestConnection = async () => {
  const db = await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'creatix',
    password: '1234',
    database: 'test_creatix',
    entities: [__dirname + '/entity/*'],
    synchronize: true,
    logging: false,
    dropSchema: true
  });
  return db;
};

export const createDevConnection = async () => {
  const db = await createConnection({
    type: 'postgres',
    host: TYPEORM_HOST,
    port: 5432,
    username: TYPEORM_USERNAME,
    password: TYPEORM_PASSWORD,
    database: TYPEORM_DATABASE,
    entities: [__dirname + '/entity/*'],
    // logging 및 synchronize는 개발용에서만
    synchronize: true,
    logging: true
  });
  return db;
};

class Database {
  public connection: Connection | null = null;

  public get connected() {
    if (!this.connection || this.connection === null) return false;
    return this.connection;
  }

  public async connectTest() {
    const db = await createTestConnection();
    this.connection = db;
    if (this.connection === null || !this.connection) {
      return new Error('DB connection error. Please make sure Postgresql is running.');
    }

    console.log('text_creatix Database Conntection ✅');
    return db;
  }

  public async connect() {
    const db = await createDevConnection();

    this.connection = db;
    if (this.connection === null || !this.connection) {
      return new Error('DB connection error. Please make sure Postgresql is running.');
    }

    console.log('creatix Database Conntection ✅');
    return db;
  }
}

const database = new Database();

export default database;
