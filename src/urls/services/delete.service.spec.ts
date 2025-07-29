import { Test, TestingModule } from '@nestjs/testing';
import { DeleteService } from './delete.service';
import { IUrlRepository } from '../database/url.repository';
import { FindByShortCode } from './find-by-short-code.service';
import { ForbiddenException } from '@nestjs/common';

describe('DeleteService', () => {
  let deleteService: DeleteService;
  let urlRepository: { softDelete: jest.Mock };
  let findByShortCode: { execute: jest.Mock };

  const mockUrl = {
    shortCode: 'abc123',
    originalUrl: 'https://example.com',
    userId: '1',
    deletedAt: null,
  };

  beforeEach(async () => {
    urlRepository = {
      softDelete: jest.fn(),
    };

    findByShortCode = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteService,
        { provide: IUrlRepository, useValue: urlRepository },
        { provide: FindByShortCode, useValue: findByShortCode },
      ],
    }).compile();

    deleteService = module.get(DeleteService);
  });

  it('should delete the URL if user is the owner and URL is not deleted', async () => {
    findByShortCode.execute.mockResolvedValue(mockUrl);
    urlRepository.softDelete.mockResolvedValue({ success: true });

    const result = await deleteService.execute('abc123', '1');

    expect(result).toEqual({ success: true });
    expect(findByShortCode.execute).toHaveBeenCalledWith('abc123');
    expect(urlRepository.softDelete).toHaveBeenCalledWith('abc123');
  });

  it('should throw ForbiddenException if URL is not found', async () => {
    findByShortCode.execute.mockResolvedValue(null);

    await expect(deleteService.execute('invalid', '1')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should throw ForbiddenException if URL is already deleted', async () => {
    findByShortCode.execute.mockResolvedValue({
      ...mockUrl,
      deletedAt: new Date(),
    });

    await expect(deleteService.execute('abc123', '1')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should throw ForbiddenException if user is not the owner', async () => {
    findByShortCode.execute.mockResolvedValue({
      ...mockUrl,
      userId: 999,
    });

    await expect(deleteService.execute('abc123', '1')).rejects.toThrow(
      ForbiddenException,
    );
  });
});
