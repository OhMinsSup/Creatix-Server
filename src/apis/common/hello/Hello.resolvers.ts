import { Resolvers } from '../../../typings/resolvers';
import { HelloQueryResponse, HelloQueryArgs } from './Hello.typing';

const resolvers: Resolvers = {
  Query: {
    Hello: (_, args: HelloQueryArgs): HelloQueryResponse => {
      return {
        result: `Hello ${args.name || 'World'}`
      };
    }
  }
};

export default resolvers;
