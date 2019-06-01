import { Resolvers, Context } from '../../../typings/resolvers';
import { UpdateIllustMutationArgs, UpdateIllustMutationResponse } from './UpdateIllust.typing';

const resolvers: Resolvers = {
  Mutation: {
    UpdateIllust: async (
      _,
      args: UpdateIllustMutationArgs,
      context: Context
    ): Promise<UpdateIllustMutationResponse> => {
      try {
        return {
          ok: true,
          error: null
        };
      } catch (e) {
        throw new Error(e);
      }
    }
  }
};

export default resolvers;
