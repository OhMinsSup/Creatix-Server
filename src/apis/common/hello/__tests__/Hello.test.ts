import faker from 'faker';
import resolvers from '../Hello.resolvers';

const username = faker.internet.userName();

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
    ).toMatchSnapshot();
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
    ).toMatchSnapshot();
  });
});
