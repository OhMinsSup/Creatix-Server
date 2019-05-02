import Joi from 'joi';
import shortid from 'shortid';
import { setImmediate } from 'timers';
import { Resolvers } from '../../../typings/resolvers';
import { SendAuthEmailArgs, SendAuthEmailResponse } from './SendAuthEmail.typing';
import { getRepository } from 'typeorm';
import User from '../../../entity/User';
import EmailAuth from '../../../entity/EmailAuth';
import { createAuthEmail } from '../../../lib/createAuthEmail';
import { sendMail } from '../../../lib/sendEmail';

const resolvers: Resolvers = {
  Mutation: {
    SendAuthEmail: async (_, args: SendAuthEmailArgs): Promise<SendAuthEmailResponse> => {
      const schema = Joi.object().keys({
        email: Joi.string()
          .email()
          .required()
      });

      const result = Joi.validate(args, schema);

      // validate error
      if (result.error) {
        return {
          ok: false,
          error: '404_EMAIL_NOT_MATCH_FORMAT'
        };
      }

      const { email } = args;

      try {
        const user = await getRepository(User).findOne({
          where: {
            email
          }
        });

        const emailAuth = new EmailAuth();
        emailAuth.code = shortid.generate();
        emailAuth.email = email;
        await getRepository(EmailAuth).save(emailAuth);

        // create email
        const emailTemplate = createAuthEmail(!!user, emailAuth.code);

        // sendEmail
        setImmediate(async () => {
          await sendMail({
            to: email,
            ...emailTemplate,
            from: 'verify@creatix.io'
          });
        });

        return {
          ok: true,
          error: null,
          registered: !!user
        };
      } catch (e) {
        throw new Error(e);
      }
    }
  }
};

export default resolvers;
