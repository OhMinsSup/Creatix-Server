import { hash, normalizePort } from '../../src/lib/utils';

describe('Utils Testing Hash', () => {
  it('create hashpassword', () => {
    expect(hash('123123')).toBe('5545f22f246b78d6e69b98acc121f1e6f0e64a6ddb1e4f388deae5e87af529eb');
  });
});

describe('Utils Testing NormalizePort', () => {
  it('Returns the type of the entered value if you enter a string type, convert it to a numeric type', () => {
    expect(normalizePort('3000')).toBe(3000);
  });
  it('Returns the type of the entered value if a numeric type is entered', () => {
    expect(normalizePort(3000)).toBe(3000);
  });
  it('Returns the type of the entered false if you enter a value that is not a number or string type but a condition', () => {
    expect(normalizePort(-3000)).toBe(false);
  });
});
