import { IsEmail, IsOptional, IsString } from 'class-validator';

export class AuthUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  role?: string;
}

export class AuthDto extends AuthUserDto {
  @IsString()
  password: string;
}

export class SignUpResponseDto {
  user: AuthUserDto;
  token: string;
}
