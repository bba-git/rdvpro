import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

interface AuditLogEntry {
  user_id: string;
  action: string;
  status: string;
  entity: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

@Injectable()
export class AuditLogService {
  constructor(@Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient) {}

  async log(
    action: string,
    userId: string,
    status: string,
    entity: string,
    metadata: Record<string, unknown> = {},
  ): Promise<void> {
    const entry: AuditLogEntry = {
      user_id: userId,
      action,
      status,
      entity,
      metadata,
      timestamp: new Date().toISOString(),
    };
    await this.supabase.from('audit_log').insert(entry);
  }
}
