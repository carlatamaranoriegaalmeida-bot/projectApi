import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { ApiResponse } from '../utils/responseWrapper.js';

export interface IAuthRequest extends Request {
  user?: { id: string; rol: string };
}

export const authenticateJWT = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error('Falta configurar la variable de entorno JWT_SECRET.');
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length).trim()
    : '';

  if (!token) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      message: 'Acceso denegado: No se proporcionó un token de autenticación válido',
      error: {
        message: 'Acceso denegado: No se proporcionó un token de autenticación válido',
        code: 'UNAUTHORIZED',
      },
      timestamp: new Date().toISOString(),
    };
    res.status(401).json(errorResponse);
    return;
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    if (
      typeof decoded !== 'object' ||
      decoded === null ||
      typeof decoded.id !== 'string' ||
      typeof decoded.rol !== 'string'
    ) {
      throw new Error('El token no contiene los datos de usuario requeridos.');
    }

    req.user = { id: decoded.id, rol: decoded.rol };
    next();
  } catch {
    const invalidResponse: ApiResponse<null> = {
      success: false,
      message: 'El token proporcionado ha expirado o su firma es inválida',
      error: {
        message: 'El token proporcionado ha expirado o su firma es inválida',
        code: 'FORBIDDEN',
      },
      timestamp: new Date().toISOString(),
    };
    res.status(403).json(invalidResponse);
  }
};