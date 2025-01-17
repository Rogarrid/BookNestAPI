import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../services/prisma/prisma.service';
import { AuthDto, SignUpResponseDto } from './dto/auth-credential.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    signUp(AuthDto: AuthDto): Promise<SignUpResponseDto>;
    signIn(AuthDto: AuthDto): Promise<string>;
}
