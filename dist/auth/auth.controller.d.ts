import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth-credential.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(AuthDto: AuthDto): Promise<{
        message: string;
        user: import("./dto/auth-credential.dto").AuthUserDto;
        token: string;
    }>;
    signIn(AuthDto: AuthDto): Promise<{
        message: string;
        token: string;
    }>;
}
