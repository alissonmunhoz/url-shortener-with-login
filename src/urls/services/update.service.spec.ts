import { Test, TestingModule } from '@nestjs/testing';
import { UpdateService } from './update.service';
import { IUrlRepository } from '../database/url.repository';
import { FindByShortCode } from './find-by-short-code.service';
import { ForbiddenException } from '@nestjs/common';

describe('UpdateService', () => {
  let updateService: UpdateService;
  let urlRepository: { updateOriginalUrl: jest.Mock };
  let findByShortCode: { execute: jest.Mock };

  const mockUrl = {
    id: '1',
    shortCode: 'abc123',
    originalUrl: 'https://old.com',
    userId: '1',
    deletedAt: null,
  };

  beforeEach(async () => {
    urlRepository = {
      updateOriginalUrl: jest.fn(),
    };

    findByShortCode = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateService,
        { provide: IUrlRepository, useValue: urlRepository },
        { provide: FindByShortCode, useValue: findByShortCode },
      ],
    }).compile();

    updateService = module.get(UpdateService);
    process.env.BASE_URI = 'http://localhost';
  });

  it('should update the original URL and return new shortUrl', async () => {
    findByShortCode.execute.mockResolvedValue(mockUrl);
    urlRepository.updateOriginalUrl.mockResolvedValue({
      ...mockUrl,
      originalUrl: 'https://new.com',
    });

    const result = await updateService.execute(
      'abc123',
      '1',
      'https://new.com',
    );

    expect(result).toEqual({
      shortUrl: 'http://localhost/abc123',
    });

    expect(findByShortCode.execute).toHaveBeenCalledWith('abc123');
    expect(urlRepository.updateOriginalUrl).toHaveBeenCalledWith(
      'abc123',
      'https://new.com',
    );
  });

  it('should throw ForbiddenException if URL not found', async () => {
    findByShortCode.execute.mockResolvedValue(null);

    await expect(
      updateService.execute('invalid', '1', 'https://new.com'),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if URL is deleted', async () => {
    findByShortCode.execute.mockResolvedValue({
      ...mockUrl,
      deletedAt: new Date(),
    });

    await expect(
      updateService.execute('abc123', '1', 'https://new.com'),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if user is not the owner', async () => {
    findByShortCode.execute.mockResolvedValue({
      ...mockUrl,
      userId: 999,
    });

    await expect(
      updateService.execute('abc123', '1', 'https://new.com'),
    ).rejects.toThrow(ForbiddenException);
  });
});
