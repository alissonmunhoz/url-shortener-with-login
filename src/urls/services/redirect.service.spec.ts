import { Test, TestingModule } from '@nestjs/testing';
import { RedirectService } from './redirect.service';
import { IUrlRepository } from '../database/url.repository';
import { FindByShortCode } from './find-by-short-code.service';
import { UnauthorizedException } from '@nestjs/common';

describe('RedirectService', () => {
  let redirectService: RedirectService;
  let urlRepository: { incrementClickCount: jest.Mock };
  let findByShortCode: { execute: jest.Mock };

  const mockUrl = {
    id: 1,
    shortCode: 'abc123',
    originalUrl: 'https://example.com',
    userId: 1,
    deletedAt: null,
  };

  beforeEach(async () => {
    urlRepository = {
      incrementClickCount: jest.fn(),
    };

    findByShortCode = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedirectService,
        { provide: IUrlRepository, useValue: urlRepository },
        { provide: FindByShortCode, useValue: findByShortCode },
      ],
    }).compile();

    redirectService = module.get(RedirectService);
  });

  it('should return original URL and increment click count', async () => {
    findByShortCode.execute.mockResolvedValue(mockUrl);
    urlRepository.incrementClickCount.mockResolvedValue(undefined);

    const result = await redirectService.execute('abc123');

    expect(findByShortCode.execute).toHaveBeenCalledWith('abc123');
    expect(urlRepository.incrementClickCount).toHaveBeenCalledWith(mockUrl.id);
    expect(result).toBe('https://example.com');
  });

  it('should throw UnauthorizedException if URL not found', async () => {
    findByShortCode.execute.mockResolvedValue(null);

    await expect(redirectService.execute('invalid123')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
