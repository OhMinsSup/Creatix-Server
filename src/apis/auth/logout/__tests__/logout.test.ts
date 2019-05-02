import faker from 'faker';
import logoutResolver from '../logout.resolvers';

describe('LogOut', () => {
  it('Success LogOut', async () => {
    const obj = {};
    const args = {};
    const ctx = {
      req: {
        user_id: faker.random.uuid()
      },
      res: {
        clearCookie: () => {}
      }
    };
    const info = {};

    const result = await logoutResolver.Mutation.LogOut(obj, args, ctx, info);
    expect(result).toEqual({
      ok: true
    });
  });
});
