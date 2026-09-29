import type { Request, Response, NextFunction } from 'express';

export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('An Error is disturbing  me', err.stack);
};