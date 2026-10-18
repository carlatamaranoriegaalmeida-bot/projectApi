import type { Request, Response } from 'express';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { createEmployeeSchema } from './employee.dto.js';
import { validateDto } from '../middleware/validation.middleware.js';

describe('Validación del DTO de empleado', () => {
  let statusMock: jest.MockedFunction<Response['status']>;
  let jsonMock: jest.MockedFunction<Response['json']>;
  let response: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn<Response['json']>();
    statusMock = jest.fn<Response['status']>(function (this: Response) {
      return this;
    });
    response = { status: statusMock, json: jsonMock };
    next = jest.fn();
  });

  describe('Escenarios positivos', () => {
    it('acepta un empleado con todos los datos válidos y continúa', async () => {
      const body = {
        name: 'Andrés Mendoza',
        position: 'Arquitecto',
        department: 'TI',
        salary: 4000,
      };
      const request = { body } as Partial<Request> as Request;
      const middleware = validateDto(createEmployeeSchema);

      await middleware(request, response as Response, next);

      expect(request.body).toEqual(body);
      expect(next).toHaveBeenCalledTimes(1);
      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  describe('Escenarios negativos', () => {
    it('rechaza un empleado con salario inválido y responde 400', async () => {
      const request = {
        body: {
          name: 'Andrés Mendoza',
          position: 'Arquitecto',
          department: 'TI',
          salary: -1,
        },
      } as Partial<Request> as Request;
      const middleware = validateDto(createEmployeeSchema);

      await middleware(request, response as Response, next);

      expect(next).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Error de validación perimetral (DTO)',
        data: ['salary: El salario debe ser un número positivo'],
      });
    });

    it('rechaza un nombre vacío', async () => {
      const request = {
        body: {
          name: '',
          position: 'Arquitecto',
          department: 'TI',
          salary: 4000,
        },
      } as Partial<Request> as Request;
      const middleware = validateDto(createEmployeeSchema);

      await middleware(request, response as Response, next);

      expect(next).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Error de validación perimetral (DTO)',
        data: ['name: El nombre es obligatorio'],
      });
    });

    it('rechaza un puesto vacío', async () => {
      const request = {
        body: {
          name: 'Andrés Mendoza',
          position: '',
          department: 'TI',
          salary: 4000,
        },
      } as Partial<Request> as Request;
      const middleware = validateDto(createEmployeeSchema);

      await middleware(request, response as Response, next);

      expect(next).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Error de validación perimetral (DTO)',
        data: ['position: El puesto es obligatorio'],
      });
    });

    it('rechaza un departamento vacío', async () => {
      const request = {
        body: {
          name: 'Andrés Mendoza',
          position: 'Arquitecto',
          department: '',
          salary: 4000,
        },
      } as Partial<Request> as Request;
      const middleware = validateDto(createEmployeeSchema);

      await middleware(request, response as Response, next);

      expect(next).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Error de validación perimetral (DTO)',
        data: ['department: El departamento es obligatorio'],
      });
    });
  });
});
