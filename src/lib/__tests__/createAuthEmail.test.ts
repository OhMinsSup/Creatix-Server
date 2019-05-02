import faker from 'faker';
import { createAuthEmail } from '../createAuthEmail';

const uuid = faker.random.uuid();

describe('CreateAuthEmail', () => {
  it('Login Email Create HTML', () => {
    expect(createAuthEmail(true, uuid)).toMatchSnapshot();
  });

  it('Register Email Create HTML', () => {
    expect(createAuthEmail(false, uuid)).toMatchSnapshot();
  });
});
