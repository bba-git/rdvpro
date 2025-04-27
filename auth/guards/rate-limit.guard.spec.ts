import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { RateLimitGuard } from './rate-limit.guard';
import { AuditLogService } from '../../supabase/audit-log.service';
import { createMock } from '@golevelup/ts-jest';

describe('RateLimitGuard', () => {
  let guard: RateLimitGuard;
  let auditLogService: AuditLogService;

  const mockAuditLog = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateLimitGuard,
        {
          provide: AuditLogService,
          useValue: mockAuditLog,
        },
      ],
    }).compile();

    guard = module.get<RateLimitGuard>(RateLimitGuard);
    auditLogService = module.get<AuditLogService>(AuditLogService);

    // Reset mock calls between tests
    jest.clearAllMocks();
    // Reset rate limit storage
    guard['resetRateLimits']();
  });

  it('should allow request when under rate limit', async () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          ip: '127.0.0.1',
          path: '/auth/forgot-password',
        }),
      }),
    });

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should block request when rate limit exceeded', async () => {
    const ip = '127.0.0.1';
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          ip,
          path: '/auth/forgot-password',
        }),
      }),
    });

    // Make 5 successful requests
    for (let i = 0; i < 5; i++) {
      await guard.canActivate(context);
    }

    // The 6th request should be blocked
    await expect(guard.canActivate(context)).rejects.toThrow(
      new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS),
    );

    expect(mockAuditLog.log).toHaveBeenCalledWith(
      'auth.rate_limit.blocked',
      ip,
      'blocked',
      'auth',
      {
        ip,
        path: '/auth/forgot-password',
        limit: 5,
        window: '1 hour',
      },
    );
  });

  it('should not apply rate limit to other endpoints', async () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          ip: '127.0.0.1',
          path: '/auth/login',
        }),
      }),
    });

    // Make more than 5 requests to a different endpoint
    for (let i = 0; i < 6; i++) {
      const result = await guard.canActivate(context);
      expect(result).toBe(true);
    }
  });

  it('should track rate limits separately for different IPs', async () => {
    const ip1 = '127.0.0.1';
    const ip2 = '127.0.0.2';

    const createContext = (ip: string) =>
      createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => ({
            ip,
            path: '/auth/forgot-password',
          }),
        }),
      });

    // Make 5 requests from IP1
    for (let i = 0; i < 5; i++) {
      await guard.canActivate(createContext(ip1));
    }

    // IP1 should be blocked
    await expect(guard.canActivate(createContext(ip1))).rejects.toThrow(
      new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS),
    );

    // IP2 should still be allowed
    const result = await guard.canActivate(createContext(ip2));
    expect(result).toBe(true);
  });
}); 