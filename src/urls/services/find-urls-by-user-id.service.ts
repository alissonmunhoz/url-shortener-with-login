import { Inject, Injectable } from '@nestjs/common';
import { IUrlRepository } from '../database/url.repository';

@Injectable()
export class findUrlsByUserId {
  constructor(
    @Inject(IUrlRepository)
    private readonly urlRepository: IUrlRepository,
  ) {}

  async execute(userId: string) {
    const findAllUrls = await this.urlRepository.findAllByUser(userId);

    if (!findAllUrls || findAllUrls.length === 0) {
      throw new Error('No URLs found for this user');
    }

    return findAllUrls;
  }
}
