import { Request, Response, NextFunction } from 'express';

export const redirectGoogleLogin = (req: Request, res: Response, next: NextFunction) => {
  res.json({
    redirectGoogleLogin: 'dsds'
  });
};

export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  res.json({
    googleCallback: 'dsds'
  });
};
