import type { Response } from "express";

interface TMeta {
  total: number;
}

interface TResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: TMeta;
  stack?: string | undefined;
}

const sendResponse = <T>(res: Response, payload: TResponse<T>): void => {
  res.status(payload.statusCode).json({
    success: payload.success,
    message: payload.message,
    ...(payload.meta !== undefined && { meta: payload.meta }),
    ...(payload.data !== undefined && { data: payload.data }),
    ...(payload.stack !== undefined && { stack: payload.stack }),
  });
};

export default sendResponse;
