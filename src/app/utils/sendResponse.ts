import type { Response } from "express";

interface TMeta {
  total: number;
}

interface TErrorSource {
  path: string | number;
  message: string;
}

interface TResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: TMeta;
  errorSources?: TErrorSource[];
  stack?: string | undefined;
}

const sendResponse = <T>(res: Response, payload: TResponse<T>): void => {
  res.status(payload.statusCode).json({
    success: payload.success,
    message: payload.message,
    ...(payload.data !== undefined && { data: payload.data }),
    ...(payload.meta !== undefined && { meta: payload.meta }),
    ...(payload.errorSources !== undefined && {
      errorSources: payload.errorSources,
    }),
    ...(payload.stack !== undefined && { stack: payload.stack }),
  });
};

export default sendResponse;
