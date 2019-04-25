import { Resolvers } from '../../../typings/resolvers';
import { CheckQueryResponse } from './check.typing';
import { Response, Request } from 'express';

const resolvers: Resolvers = {
  Query: {
    Check: (_, __, { req, res }: { res: Response; req: Request }): CheckQueryResponse => {
      return {
        result: req.cookies.token
      };
    }
  }
};

export default resolvers;
