import { NextFunction, Request, Response } from 'express';
import { ErrorWithCode } from '../exceptions/exceptions';
import { responseErrorWithObject } from '../helpers/responses';

export default function handle(err: ErrorWithCode, req: Request, res: Response, next: NextFunction) {
  console.log(err);
  responseErrorWithObject(res, {
    'message': err.message
  }, err.code);
}
