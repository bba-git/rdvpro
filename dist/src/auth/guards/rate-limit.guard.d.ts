import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuditLogService } from '../../supabase/audit-log.service';
export declare class RateLimitGuard implements CanActivate {
    private readonly auditLogService;
    private readonly rateLimits;
    private readonly MAX_REQUESTS;
    private readonly WINDOW_MS;
    private readonly TARGET_PATH;
    constructor(auditLogService: AuditLogService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private cleanupExpiredLimits;
    private resetRateLimits;
}
