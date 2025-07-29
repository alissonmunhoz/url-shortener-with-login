import { Body, Controller, Post } from '@nestjs/common';
import { SignInDTO, SignUpDTO } from './dtos/auth';
import { SignUpService } from './services/signup.service';
import { SignInService } from './services/signin.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signupService: SignUpService,
    private readonly signinService: SignInService,
  ) {}

  @Post('signup')
  async signup(@Body() body: SignUpDTO) {
    return await this.signupService.execute(body);
  }

  @Post('signin')
  async signin(@Body() body: SignInDTO) {
    return await this.signinService.execute(body);
  }
}
