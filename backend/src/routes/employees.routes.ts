import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller.js';
import { MongoEmployeeRepository } from '../repositories/mongo.employee.repository.js';
import { createEmployeeSchema, employeeIdSchema, updateEmployeeSchema } from '../dtos/employee.dto.js';
import { validateDto } from '../middleware/validation.middleware.js';

const router = Router();

// Instanciamos el repositorio y se lo pasamos al controlador
const employeeRepository = new MongoEmployeeRepository();
const employeeController = new EmployeeController(employeeRepository);

router.get('/empleados', employeeController.getEmployees);
router.get('/empleados/:id', validateDto(employeeIdSchema, 'params'), employeeController.getEmployeeById);
router.post('/empleados', validateDto(createEmployeeSchema, 'body'), employeeController.createEmployee);
router.put('/empleados/:id', validateDto(employeeIdSchema, 'params'), validateDto(updateEmployeeSchema, 'body'), employeeController.updateEmployee);
router.delete('/empleados/:id', validateDto(employeeIdSchema, 'params'), employeeController.deleteEmployee);

export default router;