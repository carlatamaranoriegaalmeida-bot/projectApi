import { z } from 'zod';

export const createEmployeeSchema = z.object({
  name: z.string().min(1, { message: "El nombre es obligatorio" }),
  position: z.string().min(1, { message: "El puesto es obligatorio" }),
  department: z.string().min(1, { message: "El departamento es obligatorio" }),
  salary: z.number().positive({ message: "El salario debe ser un número positivo" }),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export const employeeIdSchema = z.object({
  id: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: "El ID debe ser un ObjectId válido de 24 caracteres hexadecimales" }),
});

export type CreateEmployeeDTO = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeDTO = z.infer<typeof updateEmployeeSchema>;
