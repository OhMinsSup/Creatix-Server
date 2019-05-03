import { Response, Request } from 'express';
import { getRepository } from 'typeorm';
import { Resolvers } from '../../../typings/resolvers';
import { CheckUserResponse } from './CheckUser.typing';
import privateResolver from '../../../lib/privateResolver';
import User from '../../../entity/User';
import UserProfile from '../../../entity/UserProfile';

const resolvers: Resolvers = {
  Query: {
    CheckUser: privateResolver(
      async (_, __, { req }: { req: Request; res: Response }): Promise<CheckUserResponse> => {
        const userId = req['user_id'];

        if (!userId)
          return {
            ok: false,
            error: '401_ERROR_UNAUTHENTICATED',
            user: null
          };

        try {
          const userRepo = getRepository(User);
          const userProfileRepo = getRepository(UserProfile);

          const user = await userRepo.findOne({
            id: userId
          });

          const userProfile = await userProfileRepo.findOne({
            fk_user_id: userId
          });

          if (!user || !userProfile) {
            return {
              ok: false,
              error: '401_ERROR_UNAUTHENTICATED',
              user: null
            };
          }

          const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            display_name: userProfile.display_name,
            thumbnail: userProfile.thumbnail
          };

          return {
            ok: true,
            error: null,
            user: userData
          };
        } catch (e) {
          throw new Error(e);
        }
      }
    )
  }
};

export default resolvers;
