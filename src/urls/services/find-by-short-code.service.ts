import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUrlRepository } from '../database/url.repository';

@Injectable()
export class FindByShortCode {
  constructor(
    @Inject(IUrlRepository)
    private readonly urlRepository: IUrlRepository,
  ) {}

  async execute(shortCode: string) {
    const url = await this.urlRepository.findByShortCode(shortCode);

    if (!url) throw new UnauthorizedException('Url not found');

    return url;
  }
}
