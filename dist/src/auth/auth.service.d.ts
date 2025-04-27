import { SupabaseClient } from '@supabase/supabase-js';
import { AuditLogService } from '../supabase/audit-log.service';
export declare class AuthService {
    private readonly supabase;
    private readonly auditLogService;
    constructor(supabase: SupabaseClient, auditLogService: AuditLogService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
    forgotPassword(email: string): Promise<void>;
}
