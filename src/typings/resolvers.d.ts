import { Request, Response } from 'express';

export type Resolver = (parent: any, args: any, context: any, info: any) => any;

export interface Resolvers {
  [key: string]: {
    [key: string]: Resolver;
  };
}

export interface Context {
  req: Request;
  res: Response;
}
