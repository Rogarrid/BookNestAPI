import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, SignUpResponseDto } from './auth.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../decorators/public.decorator';

//TODO: reset password, reset access token with refresh token, modify password
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiBody({ type: AuthDto })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @Post('sign-up')
  async signUp(@Body() AuthDto: AuthDto): Promise<SignUpResponseDto> {
    const { message, user, token } = await this.authService.signUp(AuthDto);
    return {
      message,
      user,
      token,
    };
  }

  @Public()
  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiBody({ type: AuthDto })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @Post('sign-in')
  async signIn(@Body() AuthDto: AuthDto) {
    const token = await this.authService.signIn(AuthDto);
    return { message: 'Login successful', token };
  }
}
