import { Request } from 'express';

interface RequestBody<T> extends Request {
  body: T;
}

export { RequestBody };
