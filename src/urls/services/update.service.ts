import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { IUrlRepository } from '../database/url.repository';
import { FindByShortCode } from './find-by-short-code.service';

@Injectable()
export class UpdateService {
  constructor(
    @Inject(IUrlRepository)
    private readonly urlRepository: IUrlRepository,
    private readonly findByShortCode: FindByShortCode,
  ) {}

  async execute(shortCode: string, userId: string, newUrl: string) {
    const url = await this.findByShortCode.execute(shortCode);
    if (!url || url.deletedAt || url.userId !== userId) {
      throw new ForbiddenException();
    }

    const urlUpdated = await this.urlRepository.updateOriginalUrl(
      shortCode,
      newUrl,
    );

    return {
      shortUrl: `${process.env.BASE_URI}/${urlUpdated.shortCode}`,
    };
  }
}
