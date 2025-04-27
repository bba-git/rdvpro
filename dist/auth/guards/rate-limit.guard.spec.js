"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const rate_limit_guard_1 = require("./rate-limit.guard");
const audit_log_service_1 = require("../../supabase/audit-log.service");
const ts_jest_1 = require("@golevelup/ts-jest");
describe('RateLimitGuard', () => {
    let guard;
    const mockAuditLog = {
        log: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                rate_limit_guard_1.RateLimitGuard,
                {
                    provide: audit_log_service_1.AuditLogService,
                    useValue: mockAuditLog,
                },
            ],
        }).compile();
        guard = module.get(rate_limit_guard_1.RateLimitGuard);
        jest.clearAllMocks();
        guard['resetRateLimits']();
    });
    it('should allow request when under rate limit', async () => {
        const context = (0, ts_jest_1.createMock)({
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
        const context = (0, ts_jest_1.createMock)({
            switchToHttp: () => ({
                getRequest: () => ({
                    ip,
                    path: '/auth/forgot-password',
                }),
            }),
        });
        for (let i = 0; i < 5; i++) {
            await guard.canActivate(context);
        }
        await expect(guard.canActivate(context)).rejects.toThrow(new common_1.HttpException('Too Many Requests', common_1.HttpStatus.TOO_MANY_REQUESTS));
        expect(mockAuditLog.log).toHaveBeenCalledWith('auth.rate_limit.blocked', ip, 'blocked', 'auth', {
            path: '/auth/forgot-password',
            limit: 5,
            window: '1 hour',
            count: 6,
        });
    });
    it('should not apply rate limit to other endpoints', async () => {
        const context = (0, ts_jest_1.createMock)({
            switchToHttp: () => ({
                getRequest: () => ({
                    ip: '127.0.0.1',
                    path: '/auth/login',
                }),
            }),
        });
        for (let i = 0; i < 6; i++) {
            const result = await guard.canActivate(context);
            expect(result).toBe(true);
        }
    });
    it('should track rate limits separately for different IPs', async () => {
        const ip1 = '127.0.0.1';
        const ip2 = '127.0.0.2';
        const createContext = (ip) => (0, ts_jest_1.createMock)({
            switchToHttp: () => ({
                getRequest: () => ({
                    ip,
                    path: '/auth/forgot-password',
                }),
            }),
        });
        for (let i = 0; i < 5; i++) {
            await guard.canActivate(createContext(ip1));
        }
        await expect(guard.canActivate(createContext(ip1))).rejects.toThrow(new common_1.HttpException('Too Many Requests', common_1.HttpStatus.TOO_MANY_REQUESTS));
        const result = await guard.canActivate(createContext(ip2));
        expect(result).toBe(true);
    });
});
//# sourceMappingURL=rate-limit.guard.spec.js.map