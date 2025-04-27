import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { AuditLogService } from './audit-log.service';

const SupabaseProvider = {
  provide: 'SUPABASE_CLIENT',
  useFactory: (configService: ConfigService) => {
    return createClient(
      configService.get<string>('SUPABASE_URL'),
      configService.get<string>('SUPABASE_KEY'),
    );
  },
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [SupabaseProvider, AuditLogService],
  exports: ['SUPABASE_CLIENT', AuditLogService],
})
export class SupabaseModule {}
