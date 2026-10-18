import type { Request, Response, NextFunction } from 'express';
import type { IEmployeeRepository } from '../repositories/iemployee.repository.js';
import { sendResponse } from '../utils/responseWrapper.js';

export class EmployeeController {
  private readonly employeeRepository: IEmployeeRepository;

  constructor(employeeRepository: IEmployeeRepository) {
    this.employeeRepository = employeeRepository;
  }

  public getEmployees = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employees = await this.employeeRepository.findAll();
      sendResponse(res, 200, 'Empleados obtenidos exitosamente', employees);
    } catch (error) {
      next(error);
    }
  };

  public getEmployeeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {id} = req.params;
      
      if (typeof id !== 'string' || !id.trim()) {
        sendResponse(res, 400, 'ID de empleado inválido o no proporcionado', null);
        return;
      }

      const employee = await this.employeeRepository.findById(id);
      if (!employee) {
        sendResponse(res, 404, 'Empleado no encontrado', null);
        return;
      }
      sendResponse(res, 200, 'Empleado obtenido exitosamente', employee);

    } catch (error) {
      next(error);
    }
  };

  public createEmployee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newEmployee = await this.employeeRepository.create(req.body);
      sendResponse(res, 201, 'Empleado creado exitosamente', newEmployee);
    } catch (error) {
      next(error);
    }
  };

  public updateEmployee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
     
      if (typeof id !== 'string' || !id.trim()) {
        sendResponse(res, 400, 'ID de empleado inválido o no proporcionado', null);
        return;             
      }

      const updateData = req.body;

      if (!updateData || Object.keys(updateData).length === 0) {
        sendResponse(res, 400, 'No se proporcionaron datos para actualizar', null);
        return;
      }

      const updatedEmployee = await this.employeeRepository.update(id, updateData);

      if (!updatedEmployee) {
        sendResponse(res, 404, 'Empleado no encontrado para actualizar', null);
        return;
      }

      sendResponse(res, 200, 'Empleado actualizado exitosamente', updatedEmployee);
    } catch (error) {
       next(error);
    }
  };

  public deleteEmployee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      if (typeof id !== 'string' || !id.trim()) {
        sendResponse(res, 400, 'ID de empleado inválido o no proporcionado', null);
        return;
      }

      const deleted = await this.employeeRepository.delete(id);

      if (!deleted) {
        sendResponse(res, 404, 'Empleado no encontrado para eliminar', null);
        return;
      }

      sendResponse(res, 200, 'Empleado eliminado exitosamente', null);
    } catch (error) {
       next(error);
    }
  };
}


