import { Resolvers } from '../../../typings/resolvers';
import { HelloQueryResponse, HelloQueryArgs } from './Hello.typing';
import { Request, Response } from 'express';

const resolvers: Resolvers = {
  Query: {
    Hello: (
      _,
      args: HelloQueryArgs,
      { req, res }: { req: Request; res: Response }
    ): HelloQueryResponse => {
      res.cookie('token', '123123', {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
      });
      return {
        result: `Hello ${args.name || 'World'}`
      };
    }
  }
};

export default resolvers;
