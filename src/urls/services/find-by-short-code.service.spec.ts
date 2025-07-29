import { Test, TestingModule } from '@nestjs/testing';
import { FindByShortCode } from './find-by-short-code.service';
import { IUrlRepository } from '../database/url.repository';
import { UnauthorizedException } from '@nestjs/common';

describe('FindByShortCode', () => {
  let service: FindByShortCode;
  let urlRepository: { findByShortCode: jest.Mock };

  const mockUrl = {
    shortCode: 'abc123',
    originalUrl: 'https://example.com',
    userId: 1,
    deletedAt: null,
  };

  beforeEach(async () => {
    urlRepository = {
      findByShortCode: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindByShortCode,
        { provide: IUrlRepository, useValue: urlRepository },
      ],
    }).compile();

    service = module.get(FindByShortCode);
  });

  it('should return the URL if found', async () => {
    urlRepository.findByShortCode.mockResolvedValue(mockUrl);

    const result = await service.execute('abc123');

    expect(result).toEqual(mockUrl);
    expect(urlRepository.findByShortCode).toHaveBeenCalledWith('abc123');
  });

  it('should throw UnauthorizedException if URL not found', async () => {
    urlRepository.findByShortCode.mockResolvedValue(null);

    await expect(service.execute('invalidCode')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
