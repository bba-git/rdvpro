import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { AuditLogService } from '../../supabase/audit-log.service';

interface RateLimit {
  count: number;
  firstRequestTime: number;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly rateLimits = new Map<string, RateLimit>();
  private readonly MAX_REQUESTS = 5;
  private readonly WINDOW_MS = 60 * 60 * 1000; // 1 hour
  private readonly TARGET_PATH = '/auth/forgot-password';

  constructor(private readonly auditLogService: AuditLogService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { ip, path } = request;

    // Only apply rate limiting to forgot-password endpoint
    if (path !== this.TARGET_PATH) {
      return true;
    }

    const key = `${ip}:${path}`;
    const now = Date.now();

    // Clean up expired rate limits
    this.cleanupExpiredLimits();

    // Get or create rate limit entry
    let rateLimit = this.rateLimits.get(key);
    if (!rateLimit) {
      rateLimit = { count: 0, firstRequestTime: now };
      this.rateLimits.set(key, rateLimit);
    }

    // Reset count if window has expired
    if (now - rateLimit.firstRequestTime > this.WINDOW_MS) {
      rateLimit.count = 0;
      rateLimit.firstRequestTime = now;
    }

    // Increment request count
    rateLimit.count++;

    // Check if rate limit exceeded
    if (rateLimit.count > this.MAX_REQUESTS) {
      await this.auditLogService.log(
        'auth.rate_limit.blocked',
        ip,
        'blocked',
        'auth',
        {
          ip,
          path,
          limit: this.MAX_REQUESTS,
          window: '1 hour',
        },
      );
      throw new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    return true;
  }

  private cleanupExpiredLimits(): void {
    const now = Date.now();
    for (const [key, limit] of this.rateLimits.entries()) {
      if (now - limit.firstRequestTime > this.WINDOW_MS) {
        this.rateLimits.delete(key);
      }
    }
  }

  // For testing purposes only
  private resetRateLimits(): void {
    this.rateLimits.clear();
  }
} 