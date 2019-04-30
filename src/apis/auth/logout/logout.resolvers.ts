import { Request, Response } from 'express';
import { Resolvers } from '../../../typings/resolvers';
import privateResolver from '../../../lib/privateResolver';
import { LogOutResponse } from './logout.typing';
import { setClearTokenCookie } from '../../../lib/token';

const resolvers: Resolvers = {
  Mutation: {
    LogOut: privateResolver(
      async (
        _: any,
        __: any,
        { res }: { req: Request; res: Response }
      ): Promise<LogOutResponse> => {
        setClearTokenCookie(res);
        return {
          ok: true
        };
      }
    )
  }
};

export default resolvers;
