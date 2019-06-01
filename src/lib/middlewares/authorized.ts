import { Request, Response, NextFunction } from 'express';

const authorized = async (req: Request, res: Response, next: NextFunction) => {
  if (req['user_id']) {
    return res.status(401).json({
      ok: false,
      error: 'NOT_AUTHORIZED'
    });
  }

  return next();
};

export default authorized;
