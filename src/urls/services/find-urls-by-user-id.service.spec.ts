import { Test, TestingModule } from '@nestjs/testing';
import { findUrlsByUserId } from './find-urls-by-user-id.service';
import { IUrlRepository } from '../database/url.repository';

describe('findUrlsByUserId', () => {
  let service: findUrlsByUserId;
  let urlRepository: { findAllByUser: jest.Mock };

  const mockUrls = [
    {
      shortCode: 'abc123',
      originalUrl: 'https://example.com',
      userId: '1',
    },
    {
      shortCode: 'xyz456',
      originalUrl: 'https://google.com',
      userId: '1',
    },
  ];

  beforeEach(async () => {
    urlRepository = {
      findAllByUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        findUrlsByUserId,
        { provide: IUrlRepository, useValue: urlRepository },
      ],
    }).compile();

    service = module.get(findUrlsByUserId);
  });

  it('should return all URLs for a given user', async () => {
    urlRepository.findAllByUser.mockResolvedValue(mockUrls);

    const result = await service.execute('1');

    expect(result).toEqual(mockUrls);
    expect(urlRepository.findAllByUser).toHaveBeenCalledWith('1');
  });

  it('should return empty array if user has no URLs', async () => {
    urlRepository.findAllByUser.mockResolvedValue([]);

    const result = await service.execute('99');

    expect(result).toEqual([]);
    expect(urlRepository.findAllByUser).toHaveBeenCalledWith('99');
  });
});
