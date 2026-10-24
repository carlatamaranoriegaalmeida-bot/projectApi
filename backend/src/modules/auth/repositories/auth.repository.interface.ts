export interface IAuthRepository {
 findByEmail(email: string): Promise<any | null>;
 createUser(userData: any): Promise<any>;
}