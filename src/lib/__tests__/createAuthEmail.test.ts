import faker from 'faker';
import { createAuthEmail } from '../createAuthEmail';

const uuid = faker.random.uuid();

describe('회원 인증 이메일 템플릿', () => {
  test('로그인을 했을 때 HTML이 만들어진 경우', () => {
    expect(createAuthEmail(true, uuid)).toMatchSnapshot();
  });

  test('회원가입을 할 경우에 HTML이 만들어지는 경우', () => {
    expect(createAuthEmail(false, uuid)).toMatchSnapshot();
  });
});
