// this is to handle error globally

import { NextFunction, Request, Response } from "express";

export function globalErrorHandler(error, req: Request, res: Response, next: NextFunction) {

  res.status(error.status).json({ message: error.message, status: "error", data: null })
}