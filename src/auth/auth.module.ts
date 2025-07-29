import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthProvider } from './auth.provider';
import { IAuthRepository } from './database/auth.repository';
import { AuthImplementation } from './database/auth.implementation';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    ...AuthProvider,
    {
      provide: IAuthRepository,
      useClass: AuthImplementation,
    },
  ],
})
export class AuthModule {}
