import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { IAuthRepository } from '../repositories/auth.repository.interface.js';
import type { ApiResponse } from '../../../utils/responseWrapper.js';

interface LoginResponseData {
  token: string;
  user: {
    email: string;
    rol: string;
  };
}

export class AuthController {
  constructor(private authRepository: IAuthRepository) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const secretKey = process.env.JWT_SECRET;
      if (!secretKey) {
        throw new Error('Falta configurar la variable de entorno JWT_SECRET.');
      }

      const user = await this.authRepository.findByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        const message = 'Credenciales inválidas';
        const response: ApiResponse<null> = {
          success: false,
          message,
          error: { message, code: 'AUTH_FAILED' },
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const token = jwt.sign(
        { id: user._id.toString(), rol: user.rol },
        secretKey,
        { expiresIn: '2h' }
      );
      const response: ApiResponse<LoginResponseData> = {
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          token,
          user: { email: user.email, rol: user.rol },
        },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}