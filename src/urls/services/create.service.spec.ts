import { Test, TestingModule } from '@nestjs/testing';
import { IUrlRepository } from '../database/url.repository';
import * as crypto from 'crypto';
import { CreateUrlService } from './create.service';

describe('CreateUrlService', () => {
  let createUrlService: CreateUrlService;
  let urlRepository: { create: jest.Mock };

  beforeEach(async () => {
    urlRepository = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUrlService,
        { provide: IUrlRepository, useValue: urlRepository },
      ],
    }).compile();

    createUrlService = module.get<CreateUrlService>(CreateUrlService);
    if (!createUrlService || typeof createUrlService.execute !== 'function') {
      throw new Error(
        'Failed to instantiate CreateUrlService or missing execute method',
      );
    }
  });

  it('should create a short URL and return the full shortUrl', async () => {
    // Simula o código gerado
    const shortCode = 'abc123';
    jest.spyOn(crypto, 'randomBytes').mockReturnValue({
      toString: () => shortCode,
    } as any);

    // Define a variável de ambiente
    process.env.BASE_URI = 'http://localhost';

    const mockCreatedUrl = {
      originalUrl: 'https://example.com',
      shortCode,
      userId: '1',
    };

    urlRepository.create.mockResolvedValue(mockCreatedUrl);

    const result = await createUrlService.execute('https://example.com', '1');

    expect(result).toEqual({
      shortUrl: `http://localhost/${shortCode}`,
    });

    expect(urlRepository.create).toHaveBeenCalledWith({
      originalUrl: 'https://example.com',
      shortCode,
      userId: '1',
    });
  });
});
