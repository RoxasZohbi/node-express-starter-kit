import { type Request, type Response, type NextFunction } from 'express';

const myLogger = function (req: Request, res: Response, next: NextFunction) {
  console.log('LOGGED');
  next();
};

const myLogger2 = function (req: Request, res: Response, next: NextFunction) {
  console.log('LOGGED2');
  next();
}

export { myLogger, myLogger2 };
export * from './auth';