import faker from 'faker';
import { sendMail } from '../sendEmail';
import { createAuthEmail } from '../createAuthEmail';

// https://www.moakt.com/ko 을 통해서 가짜 이메일 가져온다
const email = 'zliglmq8t@moakt.co';
const uuid = faker.random.uuid();
const emailTemplate = createAuthEmail(false, uuid);

describe('Send Email Function', () => {
  test('메일 보내기', async () => {
    const transporter = await sendMail({
      to: email,
      ...emailTemplate,
      from: 'verify@creatix.io'
    });
    expect(transporter.envelope).toEqual({
      from: 'verify@creatix.io',
      to: [email]
    });
  });
});
