import type { NextFunction, Request, Response } from "express";

const catchAsync = (
  fn: (_req: Request, res: Response, _next: NextFunction) => Promise<void>,
) => {
  return (_req: Request, res: Response, _next: NextFunction) => {
    fn(_req, res, _next).catch(_next);
  };
};

export default catchAsync;
