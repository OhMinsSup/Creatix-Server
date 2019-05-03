import faker from 'faker';
import { sendMail } from '../sendEmail';
import { createAuthEmail } from '../createAuthEmail';

const email = '41tdysetd@tmails.net';
const from = 'testing@creatix.io';
const uuid = faker.random.uuid();
const emailTemplate = createAuthEmail(false, uuid);

describe('SendEmail', () => {
  it('testing error send as message with async/await', async () => {
    expect.assertions(1);
    try {
      await sendMail({
        from,
        to: 'hello12314412',
        ...emailTemplate
      });
    } catch (e) {
      const error = new Error(e);
      error.message = 'SENDMAIL_ERROR';
      expect(error.message).toEqual('SENDMAIL_ERROR');
    }
  });

  it('should create an account and send a message', async () => {
    expect.assertions(1);
    try {
      const transport = await sendMail({
        from,
        to: email,
        ...emailTemplate
      });

      const messageInfo = ['messageId', 'envelope', 'accepted', 'rejected', 'pending', 'response'];

      await expect(messageInfo).resolves.toContain(transport);
    } catch (e) {
      const error = new Error(e);
      error.message = 'SENDMAIL_ERROR';
      expect(error.message).toEqual('SENDMAIL_ERROR');
    }
  });
});
