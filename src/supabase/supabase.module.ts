import { Module, Global, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuditLogService } from './audit-log.service';

const SupabaseProvider = {
  provide: 'SUPABASE_CLIENT',
  useFactory: (configService: ConfigService): SupabaseClient => {
    const logger = new Logger('SupabaseModule');
    const url = configService.get<string>('SUPABASE_URL');
    const key = configService.get<string>('SUPABASE_KEY');

    if (!url || !key) {
      logger.error('❌ Missing SUPABASE_URL or SUPABASE_KEY in environment variables.');
      throw new Error('Supabase configuration is incomplete.');
    }

    logger.log('✅ Supabase client successfully initialized.');
    return createClient(url, key);
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
