import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../services/prisma/prisma.service';
import { AuthDto, SignUpResponseDto } from './dto/auth-credential.dto';
import { findUserByEmail } from '../libs/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(AuthDto: AuthDto): Promise<SignUpResponseDto> {
    const { username, email, password, role } = AuthDto;

    await findUserByEmail(this.prisma, email, 'signup');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: username ? username : '',
        email,
        password: hashedPassword,
        role: role ? role : 'user',
      },
    });

    const token = this.jwtService.sign({ email: user.email, sub: user.id });

    return { message: 'User created successfully', user, token };
  }

  async signIn(AuthDto: AuthDto): Promise<string> {
    const { email, password } = AuthDto;

    const userExists = await findUserByEmail(this.prisma, email, 'signin');

    const isPasswordValid = await bcrypt.compare(password, userExists.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.jwtService.sign({
      email: userExists.email,
      sub: userExists.id,
      role: userExists.role,
    });

    return token;
  }
}
