import { Connection, getRepository } from 'typeorm';
import SendAuthEamilResolver from '../SendAuthEmail.resolvers';
import User from '../../../../entity/User';
import { createDatabase, clearDatabase, getEntities, closeDatabase } from '../../../../test/helper';

describe('SendAuthEmail', () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createDatabase();
  });

  afterAll(async () => {
    const entities = await getEntities(connection);
    await clearDatabase(entities, connection);
    await closeDatabase(connection);
  });

  const email = '41tdysetd@tmails.net';
  const obj = {};
  const ctx = {};
  const info = {};

  function setEmail(email?: string) {
    const obj = Object.assign(
      {},
      {
        email: email ? email : ''
      }
    );
    return obj;
  }

  it('Email is not entered or format is wrong', async () => {
    try {
      const result = await SendAuthEamilResolver.Mutation.SendAuthEmail(obj, setEmail(), ctx, info);
      expect(result).toEqual({
        ok: false,
        error: '404_EMAIL_NOT_MATCH_FORMAT'
      });
    } catch (e) {
      const error = new Error(e);
      error.message = 'SEND_AUTH_EMAIL_ERROR';
      expect(error.message).toEqual('SEND_AUTH_EMAIL_ERROR');
    }
  });

  it('Email member authentication', async () => {
    try {
      const args = setEmail(email);

      const userRegisterd = await getRepository(User).findOne({
        where: {
          email: args.email
        }
      });

      const result = await SendAuthEamilResolver.Mutation.SendAuthEmail(obj, args, ctx, info);
      expect(result).toEqual({
        ok: true,
        error: null,
        registered: !!userRegisterd
      });
    } catch (e) {
      const error = new Error(e);
      error.message = 'SEND_AUTH_EMAIL_ERROR';
      expect(error.message).toEqual('SEND_AUTH_EMAIL_ERROR');
    }
  });
});
