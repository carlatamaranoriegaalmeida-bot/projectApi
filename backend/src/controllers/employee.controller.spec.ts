import type { Request, Response } from 'express';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { EmployeeController } from './employee.controller.js';
import type { IEmployee, IEmployeeRepository } from '../repositories/iemployee.repository.js';
import { createEmployeeSchema, employeeIdSchema } from '../dtos/employee.dto.js';
import { getZodRejectionCount, validateDto } from '../middleware/validation.middleware.js';

describe('🧪 Unit Test: EmployeeController (Mantenibilidad & Testabilidad)', () => {
 let controller: EmployeeController;
 let mockRepository: jest.Mocked<IEmployeeRepository>;
 let mockResponse: Partial<Response>;
 let nextMock: jest.Mock;
 let statusMock: jest.MockedFunction<Response['status']>;
 let jsonMock: jest.MockedFunction<Response['json']>;
 beforeEach(() => {
 mockRepository = {
 findAll: jest.fn(),
 findById: jest.fn(),
 create: jest.fn(),
 update: jest.fn(),
 delete: jest.fn(),
 };
 nextMock = jest.fn();
 controller = new EmployeeController(mockRepository);
 jsonMock = jest.fn<Response['json']>();
 statusMock = jest.fn<Response['status']>(function (this: Response) {
  return this;
 });
 mockResponse = { status: statusMock, json: jsonMock };
 });
 const employee: IEmployee = {
  id: 'employee-1',
  name: 'Andrés Mendoza',
  position: 'Arquitecto',
  department: 'TI',
  salary: 4000,
 };

 const makeRequest = (values: { params?: Request['params']; body?: Request['body'] } = {}): Request =>
  values as Partial<Request> as Request;

 const validateAndCreateEmployee = async (body: Request['body']): Promise<void> => {
  const request = makeRequest({ body });
  let controllerExecution: Promise<void> | undefined;

  await validateDto(createEmployeeSchema)(request, mockResponse as Response, () => {
   controllerExecution = controller.createEmployee(request, mockResponse as Response, nextMock);
  });

  await controllerExecution;
 };

 it('Debería retornar un estado 200 y la lista de empleados de la abstracción', async () => {
 const fakeEmployees: IEmployee[] = [employee];

 mockRepository.findAll.mockResolvedValue(fakeEmployees);
 await controller.getEmployees({} as Request, mockResponse as Response, nextMock);

 expect(statusMock).toHaveBeenCalledWith(200);
 expect(jsonMock).toHaveBeenCalledWith({
  success: true,
  message: 'Empleados obtenidos exitosamente',
  data: fakeEmployees,
 });
 expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
 });

 it('Debería retornar un estado 200 y el empleado encontrado por su ID', async () => {
 mockRepository.findById.mockResolvedValue(employee);

 await controller.getEmployeeById(
  makeRequest({ params: { id: employee.id } }),
  mockResponse as Response,
  nextMock,
 );

 expect(mockRepository.findById).toHaveBeenCalledWith(employee.id);
 expect(statusMock).toHaveBeenCalledWith(200);
 expect(jsonMock).toHaveBeenCalledWith({
  success: true,
  message: 'Empleado obtenido exitosamente',
  data: employee,
 });
 });

 it('Debería retornar un estado 201 al crear un empleado', async () => {
 mockRepository.create.mockResolvedValue(employee);
 const newEmployee = {
  name: employee.name,
  position: employee.position,
  department: employee.department,
  salary: employee.salary,
 };

 await controller.createEmployee(
  makeRequest({ body: newEmployee }),
  mockResponse as Response,
  nextMock,
 );

 expect(mockRepository.create).toHaveBeenCalledWith(newEmployee);
 expect(statusMock).toHaveBeenCalledWith(201);
 expect(jsonMock).toHaveBeenCalledWith({
  success: true,
  message: 'Empleado creado exitosamente',
  data: employee,
 });
 });

 describe('Validación al crear un empleado', () => {
  const validEmployee = {
   name: 'Andrés Mendoza',
   position: 'Arquitecto',
   department: 'TI',
   salary: 4000,
  };

  it('acepta los datos válidos y los procesa desde el controller', async () => {
   mockRepository.create.mockResolvedValue(employee);

   await validateAndCreateEmployee(validEmployee);

   expect(mockRepository.create).toHaveBeenCalledWith(validEmployee);
   expect(statusMock).toHaveBeenCalledWith(201);
   expect(jsonMock).toHaveBeenCalledWith({
    success: true,
    message: 'Empleado creado exitosamente',
    data: employee,
   });
   expect(nextMock).not.toHaveBeenCalled();
  });

  it('rechaza un empleado con salario inválido sin llamar al controller', async () => {
   await validateAndCreateEmployee({ ...validEmployee, salary: -1 });

   expect(mockRepository.create).not.toHaveBeenCalled();
   expect(statusMock).toHaveBeenCalledWith(400);
   expect(jsonMock).toHaveBeenCalledWith({
    success: false,
    message: 'Error de validación perimetral (DTO)',
    data: ['salary: El salario debe ser un número positivo'],
   });
  });

  it('rechaza un salario que no es numérico con el error de tipo de Zod', async () => {
   await validateAndCreateEmployee({ ...validEmployee, salary: '4000' });

   expect(mockRepository.create).not.toHaveBeenCalled();
   expect(statusMock).toHaveBeenCalledWith(400);
   expect(jsonMock).toHaveBeenCalledWith({
    success: false,
    message: 'Error de validación perimetral (DTO)',
    data: ['salary: Invalid input: expected number, received string'],
   });
   expect(nextMock).not.toHaveBeenCalled();
  });

  it('rechaza un nombre vacío sin llamar al controller', async () => {
   await validateAndCreateEmployee({ ...validEmployee, name: '' });

   expect(mockRepository.create).not.toHaveBeenCalled();
   expect(statusMock).toHaveBeenCalledWith(400);
   expect(jsonMock).toHaveBeenCalledWith({
    success: false,
    message: 'Error de validación perimetral (DTO)',
    data: ['name: El nombre es obligatorio'],
   });
  });

  it('rechaza un puesto vacío sin llamar al controller', async () => {
   await validateAndCreateEmployee({ ...validEmployee, position: '' });

   expect(mockRepository.create).not.toHaveBeenCalled();
   expect(statusMock).toHaveBeenCalledWith(400);
   expect(jsonMock).toHaveBeenCalledWith({
    success: false,
    message: 'Error de validación perimetral (DTO)',
    data: ['position: El puesto es obligatorio'],
   });
  });

  it('rechaza un departamento vacío sin llamar al controller', async () => {
   await validateAndCreateEmployee({ ...validEmployee, department: '' });

   expect(mockRepository.create).not.toHaveBeenCalled();
   expect(statusMock).toHaveBeenCalledWith(400);
   expect(jsonMock).toHaveBeenCalledWith({
    success: false,
    message: 'Error de validación perimetral (DTO)',
    data: ['department: El departamento es obligatorio'],
   });
  });

  it('rechaza un ID inválido con un error 400 de Zod', async () => {
   const request = makeRequest({ params: { id: 'invalid-id' } });

   await validateDto(employeeIdSchema, 'params')(
    request,
    mockResponse as Response,
    nextMock,
   );

   expect(statusMock).toHaveBeenCalledWith(400);
   expect(jsonMock).toHaveBeenCalledWith({
    success: false,
    message: 'Error de validación perimetral (DTO)',
    data: ['id: El ID debe ser un ObjectId válido de 24 caracteres hexadecimales'],
   });
   expect(nextMock).not.toHaveBeenCalled();
  });

  it('cuenta exactamente los rechazos de Zod frente a un lote de tráfico válido y corrupto', async () => {
   const validRequestCount = 3;
   const corruptRequestCount = 4;
   const rejectionCountBeforeBatch = getZodRejectionCount();
   mockRepository.create.mockResolvedValue(employee);

   for (let index = 0; index < validRequestCount; index += 1) {
    await validateAndCreateEmployee(validEmployee);
   }

   for (let index = 0; index < corruptRequestCount; index += 1) {
    await validateAndCreateEmployee({ ...validEmployee, salary: -1 });
   }

   const responseStatuses = statusMock.mock.calls.map(([status]) => status);
   const createdResponseCount = responseStatuses.filter((status) => status === 201).length;
   const rejectedResponseCount = responseStatuses.filter((status) => status === 400).length;

   expect(createdResponseCount).toBe(validRequestCount);
   expect(rejectedResponseCount).toBe(corruptRequestCount);
   expect(getZodRejectionCount() - rejectionCountBeforeBatch).toBe(corruptRequestCount);
   expect(mockRepository.create).toHaveBeenCalledTimes(validRequestCount);
  });
 });

 it('Debería retornar un estado 200 al actualizar un empleado', async () => {
 const updateData: Partial<IEmployee> = { salary: 4500 };
 const updatedEmployee = { ...employee, ...updateData };
 mockRepository.update.mockResolvedValue(updatedEmployee);

 await controller.updateEmployee(
  makeRequest({ params: { id: employee.id }, body: updateData }),
  mockResponse as Response,
  nextMock,
 );

 expect(mockRepository.update).toHaveBeenCalledWith(employee.id, updateData);
 expect(statusMock).toHaveBeenCalledWith(200);
 expect(jsonMock).toHaveBeenCalledWith({
  success: true,
  message: 'Empleado actualizado exitosamente',
  data: updatedEmployee,
 });
 });

 it('Debería retornar un estado 200 al eliminar un empleado', async () => {
 mockRepository.delete.mockResolvedValue(true);

 await controller.deleteEmployee(
  makeRequest({ params: { id: employee.id } }),
  mockResponse as Response,
  nextMock,
 );

 expect(mockRepository.delete).toHaveBeenCalledWith(employee.id);
 expect(statusMock).toHaveBeenCalledWith(200);
 expect(jsonMock).toHaveBeenCalledWith({
  success: true,
  message: 'Empleado eliminado exitosamente',
  data: null,
 });
 });

 it('Debería retornar un estado 404 cuando el empleado a eliminar no existe', async () => {
 mockRepository.delete.mockResolvedValue(false);

 await controller.deleteEmployee(
  makeRequest({ params: { id: employee.id } }),
  mockResponse as Response,
  nextMock,
 );

 expect(mockRepository.delete).toHaveBeenCalledWith(employee.id);
 expect(statusMock).toHaveBeenCalledWith(404);
 expect(jsonMock).toHaveBeenCalledWith({
  success: false,
  message: 'Empleado no encontrado para eliminar',
  data: null,
 });
 });
});
