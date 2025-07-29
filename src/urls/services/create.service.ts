import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { IUrlRepository } from '../database/url.repository';

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

    const newUrl = await this.urlRepository.create({
      originalUrl,
      shortCode,
      userId,
    });

    return {
      shortUrl: `${process.env.BASE_URI}/${newUrl.shortCode}`,
    };
  }
}
