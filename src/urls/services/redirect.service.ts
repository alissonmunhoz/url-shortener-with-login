import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUrlRepository } from '../database/url.repository';
import { FindByShortCode } from './find-by-short-code.service';

@Injectable()
export class RedirectService {
  constructor(
    @Inject(IUrlRepository)
    private readonly urlRepository: IUrlRepository,
    private readonly findByShortCode: FindByShortCode,
  ) {}

  async execute(shortCode: string) {
    const url = await this.findByShortCode.execute(shortCode);

    if (!url) throw new UnauthorizedException('Url not found');

    await this.urlRepository.incrementClickCount(url.id);

    return url.originalUrl;
  }
}
