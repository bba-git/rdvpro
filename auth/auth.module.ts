import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuditLogService } from '../supabase/audit-log.service';

@Module({
  imports: [SupabaseModule],
  controllers: [AuthController],
  providers: [AuthService, AuditLogService],
  exports: [AuthService], // <-- optional, for external use
})
export class AuthModule {}
