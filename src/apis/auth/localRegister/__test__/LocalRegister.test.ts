import { Connection, getRepository } from 'typeorm';
import shortid from 'shortid';
import faker from 'faker';
import LocalRegisterResolver from '../LocalRegister.resolvers';
import {
  createDatabase,
  clearDatabase,
  getEntities,
  closeDatabase
} from '../../../../../test/helper';
import EmailAuth from '../../../../entity/EmailAuth';
import { generateToken } from '../../../../lib/token';

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

  it('User LocalRegister Success', async () => {
    try {
      const email = 'testing3@tmpmail.net';

      const emailAuthRepo = getRepository(EmailAuth);
      const emailAuth = new EmailAuth();
      emailAuth.code = shortid.generate();
      emailAuth.email = email;
      await emailAuthRepo.save(emailAuth);

      const registerToken = await generateToken(
        {
          email,
          id: emailAuth.id
        },
        { expiresIn: '1h', subject: 'email-register' }
      );

      const expected = [
        'id',
        'username',
        'email',
        'display_name',
        'thumbnail',
        'access_token',
        'refresh_token'
      ];

      const result = await LocalRegisterResolver.Mutation.LocalRegister(
        {},
        {
          register_token: registerToken,
          display_name: 'registerdisplay1',
          username: 'registerusername1',
          short_bio: '테스트 계정'
        },
        {
          res: {
            cookie: () => {}
          }
        },
        {}
      );

      expect(result.ok).toEqual(true);
      expect(result.error).toEqual(null);
      expect(Object.keys(result.register)).toEqual(expect.arrayContaining(expected));
    } catch (e) {
      const error = new Error(e);
      error.message = 'LOCAL_REGISTER_ERROR';
      expect(error.message).toEqual('LOCAL_REGISTER_ERROR');
    }
  });

  it('User RegisterToken sub Equal email-register', async () => {
    try {
      const email = 'testing7@tmpmail.net';
      const registerToken = await generateToken(
        {
          email,
          id: faker.random.uuid()
        },
        { expiresIn: '1h', subject: '과연될까?' }
      );

      const result = await LocalRegisterResolver.Mutation.LocalRegister(
        {},
        {
          register_token: registerToken,
          display_name: 'registerdisplay2',
          username: 'registerusername2',
          short_bio: '테스트 계정'
        },
        {},
        {}
      );

      expect(result.ok).toEqual(false);
      expect(result.error).toEqual('400_INVALID_TOKEN');
    } catch (e) {
      const error = new Error(e);
      error.message = 'LOCAL_REGISTER_ERROR';
      expect(error.message).toEqual('LOCAL_REGISTER_ERROR');
    }
  });
});
