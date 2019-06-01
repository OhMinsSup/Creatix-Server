import { Resolvers, Context } from '../../../typings/resolvers';
import { DeleteIllustMutationArgs, DeleteIllustMutationResponse } from './DeleteIllust.typing';

const resolvers: Resolvers = {
  Mutation: {
    DeleteIllust: async (
      _,
      args: DeleteIllustMutationArgs,
      context: Context
    ): Promise<DeleteIllustMutationResponse> => {
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
