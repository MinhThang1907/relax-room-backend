import type { Response } from 'express';
import type { ApiResponse } from '../domain/types';

export const sendSuccess = <T>(res: Response, data: T, statusCode = 200) => {
  const response: ApiResponse<T> = {
    ok: true,
    data,
  };
  res.status(statusCode).json(response);
};

export const sendError = (res: Response, code: string, message: string, statusCode = 400) => {
  const response: ApiResponse<null> = {
    ok: false,
    error: { code, message },
  };
  res.status(statusCode).json(response);
};
