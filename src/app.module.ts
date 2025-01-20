import { Module } from '@nestjs/common';
import { AuthService } from './modules/auth/auth.service';
import { JwtStrategy } from './modules/jwt/jwt.strategy';
import { PrismaService } from './services/prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/jwt/jwt.guard';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './services/prisma/prisma.module';
import { NestJwtModule } from './modules/jwt/jwt.module';

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
