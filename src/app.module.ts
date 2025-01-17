import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt/jwt.strategy';
import { PrismaService } from './services/prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt/jwt.guard';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './services/prisma/prisma.module';
import { NestJwtModule } from './auth/jwt/jwt.module';

@Module({
  imports: [AuthModule, PrismaModule, NestJwtModule],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AuthService,
    PrismaService,
  ],
})
export class AppModule {}
