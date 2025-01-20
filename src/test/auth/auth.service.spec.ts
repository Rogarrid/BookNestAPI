import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../modules/auth/auth.service';
import { PrismaService } from '../../services/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto, SignUpResponseDto } from '../../modules/auth/auth.dto';
import { findUserByEmail } from '../../libs/utils';

jest.mock('../../libs/utils', () => ({
  findUserByEmail: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signUp', () => {
    it('should create a new user and return a token', async () => {
      const authDto: AuthDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
      };

      const hashedPassword = 'hashedPassword123';
      const user = {
        email: 'test@example.com',
        id: 1,
        username: 'testuser',
        role: 'user',
        password: hashedPassword,
      };
      const token = 'jwt_token';

      (findUserByEmail as jest.Mock).mockResolvedValueOnce(null);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);
      (prismaService.user.create as jest.Mock).mockResolvedValue(user);
      (jwtService.sign as jest.Mock).mockReturnValue(token);

      const result: SignUpResponseDto = await authService.signUp(authDto);

      expect(result.user).toEqual(user);
      expect(result.token).toBe(token);
    });
  });

  describe('signIn', () => {
    it('should throw an error if the password is invalid', async () => {
      const authDto: AuthDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        email: 'test@example.com',
        id: 1,
        password: 'hashedPassword',
      };

      (findUserByEmail as jest.Mock).mockResolvedValueOnce(user);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(authService.signIn(authDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should return a token if credentials are valid', async () => {
      const authDto: AuthDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        email: 'test@example.com',
        id: 1,
        password: 'hashedPassword',
        role: 'user',
      };
      const token = 'jwt_token';

      (findUserByEmail as jest.Mock).mockResolvedValueOnce(user);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      (jwtService.sign as jest.Mock).mockReturnValue(token);

      const result: string = await authService.signIn(authDto);

      expect(result).toBe(token);
    });
  });
});
