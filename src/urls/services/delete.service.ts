import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { IUrlRepository } from '../database/url.repository';
import { FindByShortCode } from './find-by-short-code.service';

@Injectable()
export class DeleteService {
  constructor(
    @Inject(IUrlRepository)
    private readonly urlRepository: IUrlRepository,
    private readonly findByShortCode: FindByShortCode,
  ) {}

  async execute(shortCode: string, userId: string) {
    const url = await this.findByShortCode.execute(shortCode);
    if (!url || url.deletedAt || url.userId !== userId) {
      throw new ForbiddenException();
    }

    const deletedUrl = await this.urlRepository.softDelete(shortCode);
    if (!deletedUrl) {
      throw new ForbiddenException('Error deleting URL');
    }

    return deletedUrl;
  }
}
