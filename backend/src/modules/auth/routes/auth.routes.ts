import { Router } from 'express';
import { MongoAuthRepository } from '../repositories/mongo-auth.repository.js';
import { AuthController } from '../controllers/auth.controller.js';
import { validateDto } from '../../../middleware/validation.middleware.js';
import { LoginSchema } from '../dtos/auth.dto.js';
const router = Router();
const authRepository = new MongoAuthRepository();
const authController = new AuthController(authRepository);
// Endpoint de login blindado perimetralmente con el DTO de Zod
router.post('/login', validateDto(LoginSchema), authController.login);
export default router;
