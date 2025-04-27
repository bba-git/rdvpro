import \{ Injectable, Inject \} from '@nestjs/common';\
import \{ SupabaseClient \} from '@supabase/supabase-js';\
\
@Injectable()\
export class AuditLogService \{\
  constructor(@Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient) \{\}\
\
  async log(action: string, userId: string, status: string, entity?: string, metadata?: any): Promise<void> \{\
    const entry = \{\
      user_id: userId,\
      action,\
      status,\
      entity,\
      metadata,\
      timestamp: new Date().toISOString()\
    \};\
    await this.supabase.from('audit_log').insert(entry);\
  \}\
\}\
}