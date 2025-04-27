import { SupabaseClient } from '@supabase/supabase-js';
export declare class AuditLogService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    log(action: string, entity: string, userId: string, metadata: string): Promise<void>;
}
