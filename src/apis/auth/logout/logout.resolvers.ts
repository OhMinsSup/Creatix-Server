import { Request, Response } from 'express';
import { Resolvers } from '../../../typings/resolvers';
import privateResolver from '../../../lib/privateResolver';
import { LogOutResponse } from './logout.typing';

const resolvers: Resolvers = {
  Mutation: {
    LogOut: privateResolver(
      async (
        _: any,
        __: any,
        { res }: { req: Request; res: Response }
      ): Promise<LogOutResponse> => {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return {
          ok: true
        };
      }
    )
  }
};

export default resolvers;
