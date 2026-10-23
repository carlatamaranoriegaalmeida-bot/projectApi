import type { IEmployeeRepository, IEmployee, NewEmployee } from "./iemployee.repository.js";
import EmployeeModel from "../models/employee.model.js";

export class MongoEmployeeRepository implements IEmployeeRepository {
    async findAll(): Promise<IEmployee[]> {
        const documents = await EmployeeModel.find();
        return documents.map(doc => ({
          ...doc.toObject(),
          id: doc._id.toString(),
        }));
    }

    async findById(id: string): Promise<IEmployee | null> {
        const document = await EmployeeModel.findById(id);
        return document
          ? ({ ...document.toObject(), id: document._id.toString() } as IEmployee)
          : null;
    }

    async create(employee: NewEmployee): Promise<IEmployee> {
    const newEmployee = new EmployeeModel(employee);
    const saved = await newEmployee.save();
    return {
      ...saved.toObject(),
      id: saved._id.toString(),
    } as IEmployee;
  }

  async update(id: string, employee: Partial<IEmployee>): Promise<IEmployee | null> {
    const updated = await EmployeeModel.findByIdAndUpdate(id, employee, { new: true });
    return updated
      ? { ...updated.toObject(), id: updated._id.toString() } as IEmployee
      : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await EmployeeModel.findByIdAndDelete(id);
    return result !== null;
  }
}