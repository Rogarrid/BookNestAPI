import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { NestJwtModule } from './jwt/jwt.module';

@Module({
  imports: [PrismaModule, NestJwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
