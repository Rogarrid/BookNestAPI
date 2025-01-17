export declare class AuthUserDto {
    username?: string;
    email: string;
    role?: string;
}
export declare class AuthDto extends AuthUserDto {
    password: string;
}
export declare class SignUpResponseDto {
    user: AuthUserDto;
    token: string;
}
