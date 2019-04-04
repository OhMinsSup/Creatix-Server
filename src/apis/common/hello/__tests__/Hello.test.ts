import { graphql } from 'graphql';
import faker from 'faker';
import schema from '../../../../schema';

const username = faker.internet.userName();
const rootValue = {};
const contex = {};

// https://stackoverflow.com/questions/42841902/how-to-test-a-graphql-api
function SetQuery(username?: string) {
  const query = `
    query {
      Hello(name: ${username ? username : ''}) {
        result
      }
    }
  `;
  return query;
}

describe('Hello GraphQL', () => {
  test('Hello World Not Value Output', async () => {
    const query = SetQuery();
    const result = await graphql(schema, query, rootValue, contex);
    const { data } = result;
    if (!data) return;
    expect(data.Hello).toEqual({ result: 'Hello World' });
    expect(data.Hello).toMatchSnapshot();
  });

  test('Hello World Using Value Output', async () => {
    const query = SetQuery(username);
    const result = await graphql(schema, query, rootValue, contex);
    const { data } = result;
    if (!data) return;
    expect(data.Hello).toEqual({ result: `Hello ${username}` });
    expect(data.Hello).toMatchSnapshot();
  });
});
