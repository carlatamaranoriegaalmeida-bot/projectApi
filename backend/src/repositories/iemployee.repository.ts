export interface IEmployee{
    id: string;
    name: string;
    position: string;
    department: string;
    salary: number;
} 

export type NewEmployee = Omit<IEmployee, 'id'>;

export interface IEmployeeRepository {  
  findAll(): Promise<IEmployee[]>;
  findById(id: string): Promise<IEmployee | null>;
  create(employee: NewEmployee): Promise<IEmployee>;
  update(id: string, employee: Partial<IEmployee>): Promise<IEmployee | null>;
  delete(id: string): Promise<boolean>;
}