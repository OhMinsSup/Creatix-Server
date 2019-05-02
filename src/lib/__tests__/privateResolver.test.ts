import faker from 'faker';
import privateResolver from '../privateResolver';
/*
const resolverFn = (obj: any, args: any, ctx: any, info: any) => {
  return { result: ctx.req.user_id };
};
*/
const userId = faker.random.uuid();

const resolve = {
  Result: privateResolver(async (obj: any, args: any, ctx: any, info: any) => {
    return {
      result: userId
    };
  })
};

describe('PrivateResolver', () => {
  it('Context Request UserID', async () => {
    const obj = {};
    const args = {};
    const ctx = {
      req: {
        user_id: userId
      }
    };
    const info = {};

    const resolverFn = await resolve.Result(obj, args, ctx, info);
    expect(resolverFn).toEqual({
      result: userId
    });
  });

  it('Not Cotext Request UserID', async () => {
    const obj = {};
    const args = {};
    const ctx = {
      req: {}
    };
    const info = {};

    const resolverFn = await resolve.Result(obj, args, ctx, info);
    expect(resolverFn).toThrowErrorMatchingSnapshot();
  });
});
