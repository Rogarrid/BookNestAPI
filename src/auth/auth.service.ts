import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../services/prisma/prisma.service';
import { AuthDto, SignUpResponseDto } from './dto/auth-credential.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(AuthDto: AuthDto): Promise<SignUpResponseDto> {
    const { username, email, password, role } = AuthDto;

    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });
    if (userExists) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: username ? username : '',
        email,
        password: hashedPassword,
        role: role ? role : 'user',
      },
    });

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return { user, token };
  }

  async signIn(AuthDto: AuthDto): Promise<string> {
    const { email, password } = AuthDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return token;
  }
}
