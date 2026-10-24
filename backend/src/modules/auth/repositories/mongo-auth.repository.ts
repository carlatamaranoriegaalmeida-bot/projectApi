
import { UserModel } from '../models/user.model.js';
import type { IAuthRepository } from './auth.repository.interface.js';
export class MongoAuthRepository implements IAuthRepository {
 async findByEmail(email: string): Promise<any | null> {
 return await UserModel.findOne({ email });
 }
 async createUser(userData: any): Promise<any> {
 const newUser = new UserModel(userData);
 return await newUser.save();
 }
}