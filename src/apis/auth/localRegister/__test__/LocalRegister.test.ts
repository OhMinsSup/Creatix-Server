import { Connection } from 'typeorm';
// import LocalRegisterResolver from '../LocalRegister.resolvers';
import {
  createDatabase,
  clearDatabase,
  getEntities,
  closeDatabase
} from '../../../../../test/helper';

describe('LocalRegister', () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createDatabase();
  });

  afterAll(async () => {
    const entities = await getEntities(connection);
    await clearDatabase(entities, connection);
    await closeDatabase(connection);
  });

  it('User LocalRegister Success', async () => {});

  it('User LocalRegister Exists Username', async () => {});

  it('User LocalRegister Exists Email', async () => {});

  it('User RegisterToken sub Equal email-register', async () => {});
});
