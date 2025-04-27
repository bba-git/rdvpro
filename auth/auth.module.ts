import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuditLogService } from '../supabase/audit-log.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { RateLimitGuard } from './guards/rate-limit.guard';

@Module({
  imports: [SupabaseModule],
  controllers: [AuthController],
  providers: [AuthService, AuditLogService, RateLimitGuard],
  exports: [AuthService],
})
export class AuthModule {}
