import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { IUrlRepository } from '../database/url.repository';
import { Counter, register } from 'prom-client';

const urlsCreatedCounter: Counter =
  (register.getSingleMetric('urls_created_total') as Counter) ||
  new Counter({
    name: 'urls_created_total',
    help: 'Total number of shortened URLs created',
  });

@Injectable()
export class CreateUrlService {
  constructor(
    @Inject(IUrlRepository)
    private readonly urlRepository: IUrlRepository,
  ) {}

  async execute(
    originalUrl: string,
    userId?: string,
  ): Promise<{ shortUrl: string }> {
    const shortCode = crypto.randomBytes(3).toString('base64url');
    console.log('Generated short code:', shortCode);
    const newUrl = await this.urlRepository.create({
      originalUrl,
      shortCode,
      userId,
    });

    urlsCreatedCounter.inc();

    return {
      shortUrl: `${process.env.BASE_URI}/${newUrl.shortCode}`,
    };
  }
}
