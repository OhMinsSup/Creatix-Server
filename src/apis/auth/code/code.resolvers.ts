import { getRepository } from 'typeorm';
import { Response } from 'express';
import EmailAuth from '../../../entity/EmailAuth';
import User from '../../../entity/User';
import UserProfile from '../../../entity/UserProfile';
import { generateToken, setTokenCookie } from '../../../lib/token';
import { Resolvers } from '../../../typings/resolvers';
import { CodeResponse, CodeArgs } from './code.typing';

const resolvers: Resolvers = {
  Query: {
    Code: async (_, args: CodeArgs, { res }: { res: Response }): Promise<CodeResponse> => {
      const { code } = args;

      try {
        // check code
        const emailAuth = await getRepository(EmailAuth).findOne({
          code
        });

        if (!emailAuth) {
          return {
            ok: false,
            error: '404_ERROR_EMAIL_NOT_FOUND'
          };
        }

        // check date
        const diff = new Date().getTime() - new Date(emailAuth.created_at).getTime();
        if (diff > 1000 * 60 * 60 * 24 || emailAuth.logged) {
          return {
            ok: false,
            error: '410_ERROR_EXPIRED_CODE'
          };
        }

        const { email } = emailAuth;
        // check user with code
        const user = await getRepository(User).findOne({
          email
        });

        if (!user) {
          // generate register token
          const registerToken = await generateToken(
            {
              email,
              id: emailAuth.id
            },
            { expiresIn: '1h', subject: 'email-register' }
          );
          return {
            ok: true,
            error: null,
            registerResult: {
              email,
              register_token: registerToken
            }
          };
        } else {
          const profile = await getRepository(UserProfile).findOne({
            fk_user_id: user.id
          });
          if (!profile)
            return {
              ok: false,
              error: '404_USER_PROFILE_NOT_FOUND'
            };

          const tokens = await user.generateUserToken();
          emailAuth.logged = true;
          getRepository(EmailAuth).save(emailAuth);

          // set Cookie
          setTokenCookie(res, tokens);

          return {
            ok: true,
            error: null,
            loginResult: {
              id: user.id,
              username: user.username,
              email: user.email,
              display_name: profile.display_name,
              thumbnail: profile.thumbnail,
              access_token: tokens.accessToken,
              refresh_token: tokens.refreshToken
            }
          };
        }
      } catch (e) {
        return {
          ok: false,
          error: e
        };
      }
    }
  }
};

export default resolvers;
