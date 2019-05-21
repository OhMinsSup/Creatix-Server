import { Request, Response } from 'express';
import { Resolvers } from '../../../typings/resolvers';
import { readIllust } from '../../../lib/repository';
import { ReadIllustQueryArgs, ReadIllustQueryResponse } from './ReadIllust.typing';

const resolvers: Resolvers = {
  Query: {
    ReadIllust: async (
      _,
      args: ReadIllustQueryArgs,
      {  }: { req: Request; res: Response }
    ): Promise<ReadIllustQueryResponse> => {
      const { username, url_slug, id } = args;

      try {
        let illust = await readIllust(username, url_slug, id);

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
