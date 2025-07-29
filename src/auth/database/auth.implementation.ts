import { Injectable } from '@nestjs/common';
import { IAuthRepository } from './auth.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'generated/prisma';

@Injectable()
export class AuthImplementation implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: { email: string; password: string }): Promise<User> {
    return this.prisma.user.create({ data });
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
