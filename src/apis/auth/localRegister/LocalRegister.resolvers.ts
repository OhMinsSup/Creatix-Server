import Joi from 'joi';
import { getRepository } from 'typeorm';
import { Resolvers, Context } from '../../../typings/resolvers';
import { LocalRegisterArgs, LocalRegisterResponse } from './LocalRegister.typing';
import { decodeToken, setTokenCookie } from '../../../lib/token';
import User from '../../../entity/User';
import EmailAuth from '../../../entity/EmailAuth';
import UserProfile from '../../../entity/UserProfile';

const resolvers: Resolvers = {
  Mutation: {
    LocalRegister: async (
      _,
      args: LocalRegisterArgs,
      context: Context
    ): Promise<LocalRegisterResponse> => {
      const schema = Joi.object().keys({
        register_token: Joi.string().required(),
        display_name: Joi.string()
          .min(1)
          .max(45)
          .required(),
        username: Joi.string()
          .regex(/^[a-z0-9-_]+$/)
          .min(3)
          .max(16)
          .required(),
        short_bio: Joi.string()
          .allow('')
          .max(140)
      });

      const result = Joi.validate(args, schema);

      // validate error
      if (result.error) {
        return {
          ok: false,
          error: '404_LOCAL_REGISTER_FORM_VALIDATION_ERROR'
        };
      }

      type RegisterToken = {
        email: string;
        id: string;
        sub: string;
      };

      const { register_token, username, display_name, short_bio } = args;

      let decoded: RegisterToken | null = null;
      try {
        decoded = await decodeToken<RegisterToken>(register_token);
        if (decoded.sub !== 'email-register') {
          return {
            ok: false,
            error: '400_INVALID_TOKEN'
          };
        }
      } catch (e) {
        const error = new Error(e);
        error.message = '400_INVALID_TOKEN';
        throw error;
      }

      try {
        const { email, id: codeId } = decoded;
        const exists = await getRepository(User)
          .createQueryBuilder()
          .where('email = :email OR username = :username', { email, username })
          .getOne();

        if (exists) {
          return {
            ok: false,
            error: '409_ALREADY_EXISTS',
            payload: email === exists.email ? 'email' : 'username'
          };
        }

        const emailAuthRepo = getRepository(EmailAuth);
        const emailAuth = await emailAuthRepo.findOne(codeId);
        if (emailAuth) {
          emailAuth.logged = true;
          await emailAuthRepo.save(emailAuth);
        }

        const userRepo = getRepository(User);
        const user = new User();
        user.email = email;
        user.username = username;
        await userRepo.save(user);

        const profile = new UserProfile();
        profile.fk_user_id = user.id;
        profile.display_name = display_name;
        profile.short_bio = short_bio;
        await getRepository(UserProfile).save(profile);

        const tokens = await user.generateUserToken();
        setTokenCookie(context.res, tokens);

        return {
          ok: true,
          error: null,
          register: {
            id: user.id,
            username: user.username,
            email: user.email,
            display_name: profile.display_name,
            thumbnail: profile.thumbnail,
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken
          }
        };
      } catch (e) {
        throw new Error(e);
      }
    }
  }
};

export default resolvers;
