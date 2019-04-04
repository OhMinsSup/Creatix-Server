import axios from 'axios';
import { getConnectionOptions, createConnection } from 'typeorm';

export class TestClient {
  public url: string;

  constructor(url: string) {
    this.url = url;
  }

  async Hello(name?: string) {
    return await axios.post(
      this.url,
      {
        query: `
            query: {
                Hello(name: ${name}) {
                    result
                }
            }
          `
      },
      {
        responseType: 'json',
        withCredentials: true
      }
    );
  }
}

export const createTestingConnection = async (resetDB: boolean = false) => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  return createConnection({
    ...connectionOptions,
    name: 'default',
    synchronize: resetDB,
    dropSchema: resetDB
  });
};
