import { User } from 'generated/prisma';

export const IAuthRepository = Symbol('IAuthRepository');

export interface IAuthRepository {
  create(data: Partial<User>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
