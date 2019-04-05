import resolvers from '../SendAuthEmail.resolvers';

describe('회원 인증 이메일을 보내주면 해당 이메일에다가 이메일을 보낸다.', () => {
  test('이메일 형식에 맞지 않게 보낼 때', async () => {
    expect(
      await resolvers.Mutation.SendAuthEmail(
        {},
        {
          email: 'hahahaha'
        },
        {},
        {}
      )
    ).toEqual({
      registered: null
    });
  });

  test('사용자가 회원 인증 이메일을 요청하면 회원가입 또는 로그인 인증 이메일을 보낸다.', async () => {
    expect(
      await resolvers.Mutation.SendAuthEmail(
        {},
        {
          email: 'tx3eflk5u@tmpmail.net'
        },
        {},
        {}
      )
    ).toMatchSnapshot();
  });
});
