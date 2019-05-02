import HelloResolver from '../Hello.resolvers';

describe('Hello Resolvers', () => {
  const obj = {};
  const ctx = {};
  const info = {};

  function setName(name?: string) {
    const args = Object.assign(
      {},
      {
        name: name ? name : ''
      }
    );
    return args;
  }

  it('Return Result Value Hello World', async () => {
    const args = setName();
    const result = await HelloResolver.Query.Hello(obj, args, ctx, info);
    expect(result).toEqual({
      result: 'Hello World'
    });
  });

  it('Return Result Value Hello Args', async () => {
    const args = setName('veloss');
    const result = await HelloResolver.Query.Hello(obj, args, ctx, info);
    expect(result).toEqual({
      result: `Hello ${args.name}`
    });
  });
});
