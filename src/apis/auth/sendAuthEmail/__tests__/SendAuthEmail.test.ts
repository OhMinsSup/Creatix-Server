import { Connection, getRepository } from 'typeorm';
import { createConnect } from '../../../../connectdb';
import SendAuthEamilResolver from '../SendAuthEmail.resolvers';
import User from '../../../../entity/User';

describe('SendAuthEmail', () => {
  let connection: Connection;
  const email = 's0ob1kfsb@tmails.net';
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

  beforeAll(async () => {
    connection = await createConnect(true);
  });

  afterAll(async () => {
    connection.close();
  });

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
