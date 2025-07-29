import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthRepository } from '../database/auth.repository';
import { SignInDTO } from '../dtos/auth';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SignInService {
  constructor(
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
    private jwtService: JwtService,
  ) {}

  async execute(data: SignInDTO) {
    const user = await this.authRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
    });

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
    });

    return {
      id: user.id,
      email: user.email,
      accessToken,
    };
  }
}
