import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../modules/auth/auth.controller';
import { AuthService } from '../../modules/auth/auth.service';
import { AuthDto } from '../../modules/auth/auth.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn(),
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should sign up a new user and return a token', async () => {
      const authDto: AuthDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
      };

      const result = {
        message: 'User created successfully',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          role: 'user',
        },
        token: 'jwt_token',
      };

      jest.spyOn(authService, 'signUp').mockResolvedValue(result);

      expect(await authController.signUp(authDto)).toEqual({
        message: 'User created successfully',
        user: result.user,
        token: result.token,
      });
    });
  });

  describe('signIn', () => {
    it('should sign in an existing user and return a token', async () => {
      const authDto: AuthDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const token = 'jwt_token';

      jest.spyOn(authService, 'signIn').mockResolvedValue(token);

      expect(await authController.signIn(authDto)).toEqual({
        message: 'Login successful',
        token,
      });
    });
  });
});
