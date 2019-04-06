import resolvers from '../Hello.resolvers';

const username = 'Veloss';

describe('Hello GraphQL', () => {
  test('Hello World Not Value Output', async () => {
    expect(
      await resolvers.Query.Hello(
        {},
        {
          name: ''
        },
        {},
        {}
      )
    ).toEqual({
      result: 'Hello World'
    });
  });

  test('Hello World Using Value Output', async () => {
    expect(
      await resolvers.Query.Hello(
        {},
        {
          name: username
        },
        {},
        {}
      )
    ).toEqual({
      result: `Hello ${username}`
    });
  });
});
