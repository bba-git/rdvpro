"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const audit_log_service_1 = require("../../supabase/audit-log.service");
let RateLimitGuard = class RateLimitGuard {
    constructor(auditLogService) {
        this.auditLogService = auditLogService;
        this.rateLimits = new Map();
        this.MAX_REQUESTS = 5;
        this.WINDOW_MS = 60 * 60 * 1000;
        this.TARGET_PATH = '/auth/forgot-password';
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const { ip, path } = request;
        if (path !== this.TARGET_PATH) {
            return true;
        }
        const key = `${ip}:${path}`;
        const now = Date.now();
        this.cleanupExpiredLimits();
        let rateLimit = this.rateLimits.get(key);
        if (!rateLimit) {
            rateLimit = { count: 0, firstRequestTime: now };
            this.rateLimits.set(key, rateLimit);
        }
        if (now - rateLimit.firstRequestTime > this.WINDOW_MS) {
            rateLimit.count = 0;
            rateLimit.firstRequestTime = now;
        }
        rateLimit.count++;
        if (rateLimit.count > this.MAX_REQUESTS) {
            await this.auditLogService.log('auth.rate_limit.blocked', 'auth', ip, JSON.stringify({
                path,
                limit: this.MAX_REQUESTS,
                window: '1 hour',
                count: rateLimit.count
            }));
            throw new common_1.HttpException('Too Many Requests', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        return true;
    }
    cleanupExpiredLimits() {
        const now = Date.now();
        for (const [key, limit] of this.rateLimits.entries()) {
            if (now - limit.firstRequestTime > this.WINDOW_MS) {
                this.rateLimits.delete(key);
            }
        }
    }
    resetRateLimits() {
        this.rateLimits.clear();
    }
};
exports.RateLimitGuard = RateLimitGuard;
exports.RateLimitGuard = RateLimitGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_log_service_1.AuditLogService])
], RateLimitGuard);
//# sourceMappingURL=rate-limit.guard.js.map