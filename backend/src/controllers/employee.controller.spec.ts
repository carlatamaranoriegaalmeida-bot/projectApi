import type { Request, Response } from 'express';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { EmployeeController } from './employee.controller.js';
import type { IEmployee, IEmployeeRepository } from '../repositories/iemployee.repository.js';

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

 await controller.createEmployee(
  makeRequest({ body: employee }),
  mockResponse as Response,
  nextMock,
 );

 expect(mockRepository.create).toHaveBeenCalledWith(employee);
 expect(statusMock).toHaveBeenCalledWith(201);
 expect(jsonMock).toHaveBeenCalledWith({
  success: true,
  message: 'Empleado creado exitosamente',
  data: employee,
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
});
