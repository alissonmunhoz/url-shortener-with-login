import { Inject, Injectable } from '@nestjs/common';
import { IUrlRepository } from '../database/url.repository';

@Injectable()
export class findUrlsByUserId {
  constructor(
    @Inject(IUrlRepository)
    private readonly urlRepository: IUrlRepository,
  ) {}

  async execute(userId: string) {
    return await this.urlRepository.findAllByUser(userId);
  }
}
