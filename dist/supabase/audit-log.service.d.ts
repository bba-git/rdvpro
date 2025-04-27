import { SupabaseClient } from '@supabase/supabase-js';
export declare class AuditLogService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    log(action: string, userId: string, status: string, entity?: string, metadata?: any): Promise<void>;
}
