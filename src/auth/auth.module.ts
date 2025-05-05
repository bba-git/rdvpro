import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuditLogService } from '../supabase/audit-log.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SupabaseModule,
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuditLogService,
    RateLimitGuard,
    JwtAuthGuard,
    JwtStrategy,
  ],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
