import { Connection, getRepository } from 'typeorm';
import CheckUserResolver from '../CheckUser.resolvers';
import UserProfile from '../../../../entity/UserProfile';
import User from '../../../../entity/User';
import {
  createDatabase,
  clearDatabase,
  getEntities,
  closeDatabase
} from '../../../../../test/helper';

describe('CheckUser', () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createDatabase();
  });

  afterAll(async () => {
    const entities = await getEntities(connection);
    await clearDatabase(entities, connection);
    await closeDatabase(connection);
  });

  it('CheckUser Suucess', async () => {
    try {
      const userRepo = getRepository(User);
      const user = new User();
      user.email = 'testing8@tmpmail.net';
      user.username = 'username2';
      await userRepo.save(user);

      const profileRepo = getRepository(UserProfile);
      const profile = new UserProfile();
      profile.fk_user_id = user.id;
      profile.display_name = 'profile2';
      profile.short_bio = '테스트 소개';
      await profileRepo.save(profile);

      const expected = ['id', 'username', 'email', 'display_name', 'thumbnail'];

      const result = await CheckUserResolver.Query.CheckUser(
        {},
        {
          req: {
            user_id: user.id
          }
        },
        {},
        {}
      );

      expect(result.ok).toEqual(true);
      expect(result.error).toEqual(null);
      expect(Object.keys(result.user)).toEqual(expect.arrayContaining(expected));
    } catch (e) {
      const error = new Error(e);
      error.message = 'CHECK_USER_ERROR';
      expect(error.message).toEqual('CHECK_USER_ERROR');
    }
  });

  it('CheckUser Request Not Define UserID', async () => {
    try {
      const result = await CheckUserResolver.Query.CheckUser(
        {},
        {
          req: {
            user_id: null
          }
        },
        {},
        {}
      );

      expect(result.ok).toEqual(true);
      expect(result.error).toEqual('401_ERROR_UNAUTHENTICATED');
      expect(result.user).toEqual(null);
    } catch (e) {
      const error = new Error(e);
      error.message = 'CHECK_USER_ERROR';
      expect(error.message).toEqual('CHECK_USER_ERROR');
    }
  });
});
