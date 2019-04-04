import { Connection } from 'typeorm';
import faker from 'faker';
import { createTestingConnection } from '../../lib/testing/TestingUtils';
import User from '../User';

const email = faker.internet.email();
const username = faker.internet.userName();

jest.useFakeTimers();
Date.now = jest.fn(() => 1503187200000);
let connection: Connection;

beforeAll(async () => {
  connection = await createTestingConnection(true);
});
afterAll(async () => {
  connection.close();
});

describe('User Entity', () => {
  test('#Create', async () => {
    const user = new User();
    user.email = email;
    user.username = username;
    await connection.manager.save(user);
    const userData = await connection.manager.findOne(User);
    expect(userData).toBeDefined();
  });
});
