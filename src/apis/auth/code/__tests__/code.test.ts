import { Connection, getRepository } from 'typeorm';
import shortid from 'shortid';
import CodeResolver from '../code.resolvers';
import EmailAuth from '../../../../entity/EmailAuth';
import UserProfile from '../../../../entity/UserProfile';
import User from '../../../../entity/User';
import { createDatabase, clearDatabase, getEntities, closeDatabase } from '../../../../test/helper';

describe('CodeResolver', () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createDatabase();
  });

  afterAll(async () => {
    const entities = await getEntities(connection);
    await clearDatabase(entities, connection);
    await closeDatabase(connection);
  });

  const obj = {};
  const ctx = {
    res: {
      cookie: () => {}
    }
  };
  const info = {};
  function setCode(code?: string) {
    const args = Object.assign(
      {},
      {
        code: code ? code : ''
      }
    );
    return args;
  }

  it('Code Register', async () => {
    try {
      const emailAuthRepo = getRepository(EmailAuth);
      const emailAuth = new EmailAuth();
      emailAuth.code = shortid.generate();
      emailAuth.email = 'testing1@tmpmail.net';
      await emailAuthRepo.save(emailAuth);

      const expected = ['email', 'register_token'];

      const result = await CodeResolver.Query.Code(obj, setCode(emailAuth.code), ctx, info);
      expect(result.ok).toEqual(true);
      expect(result.error).toEqual(null);
      expect(Object.keys(result.registerResult)).toEqual(expect.arrayContaining(expected));
    } catch (e) {
      const error = new Error(e);
      error.message = 'CODE_REGISTER_ERROR';
      expect(error.message).toEqual('CODE_REGISTER_ERROR');
    }
  });

  it('Code Login', async () => {
    try {
      const userRepo = getRepository(User);
      const user = new User();
      user.email = 'testing2@tmpmail.net';
      user.username = 'username1';
      await userRepo.save(user);

      const profileRepo = getRepository(UserProfile);
      const profile = new UserProfile();
      profile.fk_user_id = user.id;
      profile.display_name = 'profile1';
      profile.short_bio = '테스트 소개';
      await profileRepo.save(profile);

      const emailAuthRepo = getRepository(EmailAuth);
      const emailAuth = new EmailAuth();
      emailAuth.code = shortid.generate();
      emailAuth.email = 'testing2@tmpmail.net';
      await emailAuthRepo.save(emailAuth);

      const expected = [
        'id',
        'username',
        'email',
        'display_name',
        'thumbnail',
        'access_token',
        'refresh_token'
      ];

      const result = await CodeResolver.Query.Code(obj, setCode(emailAuth.code), ctx, info);
      expect(result.ok).toEqual(true);
      expect(result.error).toEqual(null);
      expect(Object.keys(result.loginResult)).toEqual(expect.arrayContaining(expected));
    } catch (e) {
      const error = new Error(e);
      error.message = 'CODE_LOGIN_ERROR';
      expect(error.message).toEqual('CODE_LOGIN_ERROR');
    }
  });
});
