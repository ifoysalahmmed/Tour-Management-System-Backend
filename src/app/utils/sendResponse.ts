import { type Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  stack?: string | undefined;
};

const sendResponse = <T>(res: Response, payload: TResponse<T>): void => {
  res.status(payload.statusCode).json({
    success: payload.success,
    message: payload.message,
    ...(payload.data !== undefined && { data: payload.data }),
    ...(payload.stack !== undefined && { stack: payload.stack }),
  });
};

export default sendResponse;
