import { TestClient } from '../../../../lib/testing/TestingUtils';

describe('Hello GraphQL', () => {
  test('Hello World Output', async () => {
    const client = new TestClient(process.env.TEST_HOST as string);

    const response = await client.Hello();
    expect(response.data.Hello.result).toMatchSnapshot();
  });
});
