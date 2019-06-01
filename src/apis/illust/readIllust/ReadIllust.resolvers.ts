import { getRepository } from 'typeorm';
import { Resolvers, Context } from '../../../typings/resolvers';
import { readIllust } from '../../../services/repository';
import User from '../../../entity/User';
import { ReadIllustQueryArgs, ReadIllustQueryResponse } from './ReadIllust.typing';

const resolvers: Resolvers = {
  Query: {
    ReadIllust: async (
      _,
      args: ReadIllustQueryArgs,
      context: Context
    ): Promise<ReadIllustQueryResponse> => {
      const { username, url_slug, id } = args;
      const userRepo = getRepository(User);
      let userData: User | null = null;

      try {
        let illust = await readIllust(username, url_slug);
        if (!illust) {
          const user = await userRepo.findOne({
            where: username
          });

          if (!user) {
            return {
              ok: false,
              error: '404_USER_NOT_FOUND',
              illust: null
            };
          }

          userData = user;
          illust = await readIllust('', '', id);
          if (!illust) {
            return {
              ok: false,
              error: '404_ILLUST_NOT_FOUND',
              illust: null
            };
          }
        }

        if (illust.is_private === true && (userData && userData.username) !== username) {
          return {
            ok: false,
            error: '404_SERVER_ERROR',
            illust: null
          };
        }

        return {
          ok: true,
          error: null,
          illust
        };
      } catch (e) {
        throw new Error(e);
      }
    }
  }
};

export default resolvers;
