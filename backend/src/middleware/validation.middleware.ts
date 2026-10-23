import type { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { sendResponse } from '../utils/responseWrapper.js';

let zodRejectionCount = 0;

export const getZodRejectionCount = (): number => zodRejectionCount;

export const validateDto = (schema: z.ZodTypeAny, source: 'body' | 'params' | 'query' = 'body') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = await schema.parseAsync(req[source]);
      req[source] = validatedData;
      next();

    } catch (error) {
      if (error instanceof ZodError) {
        zodRejectionCount += 1;
        const errorMessages = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
        sendResponse(res, 400, 'Error de validación perimetral (DTO)', errorMessages);
        return;
      }
      next(error);

    }
  };
};