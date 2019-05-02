import { Connection, getRepository } from 'typeorm';
import SendAuthEamilResolver from '../SendAuthEmail.resolvers';
import User from '../../../../entity/User';
import {
  createDatabase,
  clearDatabase,
  getEntities,
  closeDatabase
} from '../../../../../test/helper';

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

  const email = 'avidrp8cm@disbox.net';
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
    const args = setEmail();
    const result = await SendAuthEamilResolver.Mutation.SendAuthEmail(obj, args, ctx, info);
    expect(result).toEqual({
      ok: false,
      error: '404_EMAIL_NOT_MATCH_FORMAT'
    });
  });

  it('Email member authentication', async () => {
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
  });

  it('SendAuthEmail 500 Error Throw', async () => {
    const args = setEmail(email);
    const result = await SendAuthEamilResolver.Mutation.SendAuthEmail(obj, args, ctx, info);
    expect(result).toThrowErrorMatchingSnapshot();
  });
});
