import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { UrlsModule } from './urls/urls.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [PrometheusModule.register(), AuthModule, UrlsModule],
  providers: [AppService, PrismaService],
})
export class AppModule {}
