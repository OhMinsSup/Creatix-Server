import { Resolvers, Context } from '../../../typings/resolvers';
import { DeleteIllustMutationArgs, DeleteIllustMutationResponse } from './DeleteIllust.typing';
import { checkUser } from '../../../services/userServices';
import { getRepository } from 'typeorm';
import IllustImage from '../../../entity/IllustImage';
import IllustsTags from '../../../entity/IllustsTags';
import Illust from '../../../entity/Illust';

const resolvers: Resolvers = {
  Mutation: {
    DeleteIllust: async (
      _,
      args: DeleteIllustMutationArgs,
      context: Context
    ): Promise<DeleteIllustMutationResponse> => {
      const userId: string = context.req['user_id'];
      const { illustId } = args;
      console.log(illustId);

      try {
        const check = await checkUser(userId);
        if (!check) {
          return {
            ok: false,
            error: '404_USER_NOT_FOUND'
          };
        }
      } catch (e) {
        throw new Error(e);
      }

      try {
        const illustImageRepo = await getRepository(IllustImage);
        const illustTagRepo = await getRepository(IllustsTags);
        await illustImageRepo
          .createQueryBuilder()
          .delete()
          .where('fk_illust_id = :illustId', { illustId })
          .execute();
        await illustTagRepo
          .createQueryBuilder()
          .delete()
          .where('fk_illust_id = :illustId', { illustId })
          .execute();
      } catch (e) {
        throw new Error(e);
      }

      try {
        const illustRepo = await getRepository(Illust);
        await illustRepo
          .createQueryBuilder()
          .delete()
          .where('id = :id', { id: illustId })
          .execute();
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
