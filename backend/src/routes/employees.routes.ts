import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller.js';
import { MongoEmployeeRepository } from '../repositories/mongo.employee.repository.js';
import { createEmployeeSchema, employeeIdSchema, updateEmployeeSchema } from '../dtos/employee.dto.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { validateDto } from '../middleware/validation.middleware.js';

const router = Router();
const employeeRepository = new MongoEmployeeRepository();
const employeeController = new EmployeeController(employeeRepository);

router.use(authenticateJWT);

router.route('/')
  .get(employeeController.getEmployees)
  .post(
    validateDto(createEmployeeSchema, 'body'),
    employeeController.createEmployee
  );

router.route('/:id')
  .get(
    validateDto(employeeIdSchema, 'params'),
    employeeController.getEmployeeById
  )
  .put(
    validateDto(employeeIdSchema, 'params'),
    validateDto(updateEmployeeSchema, 'body'),
    employeeController.updateEmployee
  )
  .delete(
    validateDto(employeeIdSchema, 'params'),
    employeeController.deleteEmployee
  );

export default router;