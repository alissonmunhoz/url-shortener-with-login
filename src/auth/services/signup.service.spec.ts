import { Test, TestingModule } from '@nestjs/testing';
import { SignUpService } from './signup.service';
import { IAuthRepository } from '../database/auth.repository';

describe('SignUpService', () => {
  let signUpService: SignUpService;
  let authRepository: Partial<IAuthRepository>;

  const mockUser = {
    id: 'user-id',
    email: 'test@example.com',
    password: 'hashed-password',
  };

  beforeEach(async () => {
    authRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpService,
        { provide: IAuthRepository, useValue: authRepository },
      ],
    }).compile();

    signUpService = module.get(SignUpService);
  });

  it('should throw an error if user already exists', async () => {
    (authRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

    await expect(
      signUpService.execute({ email: mockUser.email, password: 'anypass' }),
    ).rejects.toThrow('User already exists');
  });
});
