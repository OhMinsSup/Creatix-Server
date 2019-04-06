import faker from 'faker';
import { createAuthEmail } from '../createAuthEmail';

const uuid = faker.random.uuid();

function checkAuth(registerd: boolean) {
  const { subject, body } = createAuthEmail(registerd, uuid);
  return {
    subject,
    body
  };
}

describe('회원 인증 이메일 템플릿', () => {
  test('로그인을 했을 때 HTML이 만들어진 경우', () => {
    expect(checkAuth(true)).toEqual(checkAuth(true));
  });

  test('회원가입을 할 경우에 HTML이 만들어지는 경우', () => {
    expect(checkAuth(false)).toEqual(checkAuth(false));
  });
});
