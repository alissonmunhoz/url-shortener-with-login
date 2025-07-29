import { Inject, Injectable } from '@nestjs/common';
import { IAuthRepository } from '../database/auth.repository';
import * as brcrypt from 'bcrypt';
import { SignUpDTO } from '../dtos/auth';

@Injectable()
export class SignUpService {
  constructor(
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(data: SignUpDTO) {
    const existingUser = await this.authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await brcrypt.hash(data.password, 10);

    const user = await this.authRepository.create({
      ...data,
      password: hashedPassword,
    });
    return user;
  }
}
