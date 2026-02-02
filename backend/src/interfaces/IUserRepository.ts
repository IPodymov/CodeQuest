import { User } from '../models/User';
export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    create(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByName(name: string): Promise<User | null>;
    save(user: User): Promise<User>;
    findAll(limit?: number): Promise<User[]>;
    findTopRated(limit: number, excludeRoles?: Array<User['role']>): Promise<User[]>;
    count(): Promise<number>;
}
