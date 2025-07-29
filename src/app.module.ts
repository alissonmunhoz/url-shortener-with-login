import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { UrlsModule } from './urls/urls.module';

@Module({
  imports: [AuthModule, UrlsModule],
  providers: [AppService, PrismaService],
})
export class AppModule {}
