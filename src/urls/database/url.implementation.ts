import { Injectable } from '@nestjs/common';

import { IUrlRepository } from './url.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { Url } from 'generated/prisma';

@Injectable()
export class UrlImplementation implements IUrlRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    originalUrl: string;
    shortCode: string;
    userId?: string;
  }): Promise<Url> {
    return this.prisma.url.create({ data });
  }

  async findByShortCode(shortCode: string): Promise<Url | null> {
    return this.prisma.url.findFirst({
      where: { shortCode, deletedAt: null },
    });
  }

  async findById(id: string): Promise<Url | null> {
    return this.prisma.url.findUnique({ where: { id } });
  }

  async updateOriginalUrl(shortCode: string, url: string): Promise<Url> {
    return this.prisma.url.update({
      where: { shortCode },
      data: { originalUrl: url },
    });
  }

  async incrementClickCount(id: string): Promise<void> {
    await this.prisma.url.update({
      where: { id },
      data: { clickCount: { increment: 1 } },
    });
  }

  async softDelete(shortCode: string): Promise<Url> {
    return this.prisma.url.update({
      where: { shortCode },
      data: { deletedAt: new Date() },
    });
  }

  async findAllByUser(userId: string): Promise<Url[]> {
    return this.prisma.url.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }
}
