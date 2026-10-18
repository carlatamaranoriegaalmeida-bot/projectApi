import type { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/responseWrapper.js';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('CRITICAL ERROR:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  sendResponse(res, statusCode, message, null);
};