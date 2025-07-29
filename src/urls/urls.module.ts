import { Module } from '@nestjs/common';
import { UrlsController } from './urls.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UrlProviders } from './url.provider';
import { IUrlRepository } from './database/url.repository';
import { UrlImplementation } from './database/url.implementation';

@Module({
  controllers: [UrlsController],
  providers: [
    PrismaService,
    ...UrlProviders,
    {
      provide: IUrlRepository,
      useClass: UrlImplementation,
    },
  ],
})
export class UrlsModule {}
