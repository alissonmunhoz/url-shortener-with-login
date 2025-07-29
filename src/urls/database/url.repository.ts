import { Url } from 'generated/prisma';

export const IUrlRepository = Symbol('IUrlRepository');

export interface IUrlRepository {
  create(data: Partial<Url>): Promise<Url>;
  findByShortCode(shortCode: string): Promise<Url | null>;
  findById(id: string): Promise<Url | null>;
  updateOriginalUrl(shortCode: string, url: string): Promise<Url>;
  incrementClickCount(id: string): Promise<void>;
  softDelete(shortCode: string): Promise<Url>;
  findAllByUser(userId: string): Promise<Url[]>;
}
