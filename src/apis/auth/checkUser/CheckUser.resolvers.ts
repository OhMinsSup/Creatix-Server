import { Resolvers } from '../../../typings/resolvers';
import { CheckUserResponse } from './CheckUser.typing';
import { Response } from 'express';

const resolvers: Resolvers = {
  Query: {
    CheckUser: async (_, __, { res }: { res: Response }): Promise<CheckUserResponse> => {
      try {
        return {
          ok: true,
          error: null,
          user: null
        };
      } catch (e) {
        return {
          ok: false,
          error: e,
          user: null
        };
      }
    }
  }
};

export default resolvers;
