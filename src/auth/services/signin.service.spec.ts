import { Test, TestingModule } from '@nestjs/testing';
import { SignInService } from './signin.service';
import { IAuthRepository } from '../database/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('SignInService', () => {
  let signInService: SignInService;
  let authRepository: Partial<IAuthRepository>;
  let jwtService: Partial<JwtService>;

  const mockUser = {
    id: 'user-id',
    email: 'test@example.com',
    password: 'hashed-password',
  };

  beforeEach(async () => {
    authRepository = {
      findByEmail: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignInService,
        { provide: IAuthRepository, useValue: authRepository },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    signInService = module.get(SignInService);
  });

  it('should throw UnauthorizedException if user not found', async () => {
    (authRepository.findByEmail as jest.Mock).mockResolvedValue(null);

    await expect(
      signInService.execute({
        email: 'notfound@example.com',
        password: '',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return user data and accessToken when valid user found', async () => {
    (authRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (jwtService.signAsync as jest.Mock).mockResolvedValue('mocked-token');

    const result = await signInService.execute({
      email: mockUser.email,
      password: '',
    });

    expect(result).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      accessToken: 'mocked-token',
    });

    expect(authRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      id: mockUser.id,
      email: mockUser.email,
    });
  });
});
