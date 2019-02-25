import { hash } from '../../src/lib/utils';

describe('Utils Testing', () => {
  test('create hashpassword', () => {
    expect(hash('123123')).toBe('5545f22f246b78d6e69b98acc121f1e6f0e64a6ddb1e4f388deae5e87af529eb');
  });

  test('normalize port', () => {
    it('Not Number', () => {});
    it('Number', () => {});
    it('Boolean', () => {});
  });
});
