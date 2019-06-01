import { Resolvers, Context } from '../../../typings/resolvers';
import privateResolver from '../../../lib/privateResolver';
import { LogOutResponse } from './logout.typing';
import { setClearTokenCookie } from '../../../lib/token';

const resolvers: Resolvers = {
  Mutation: {
    LogOut: privateResolver(
      async (_: any, __: any, context: Context): Promise<LogOutResponse> => {
        setClearTokenCookie(context.res);
        return {
          ok: true
        };
      }
    )
  }
};

export default resolvers;
