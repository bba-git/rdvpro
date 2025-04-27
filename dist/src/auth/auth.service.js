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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const audit_log_service_1 = require("../supabase/audit-log.service");
let AuthService = class AuthService {
    constructor(supabase, auditLogService) {
        this.supabase = supabase;
        this.auditLogService = auditLogService;
    }
    async validateUser(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                await this.auditLogService.log('auth.login.failure', 'auth', 'anonymous', JSON.stringify({ email, error: error.message }));
                return null;
            }
            await this.auditLogService.log('auth.login.success', 'auth', data.user.id, JSON.stringify({ email }));
            return {
                id: data.user.id,
                email: data.user.email,
                session: data.session,
            };
        }
        catch (error) {
            await this.auditLogService.log('auth.login.error', 'auth', 'anonymous', JSON.stringify({ email, error: error.message }));
            return null;
        }
    }
    async login(user) {
        return {
            access_token: user.session.access_token,
        };
    }
    async forgotPassword(email) {
        try {
            const { error } = await this.supabase.auth.resetPasswordForEmail(email);
            if (error) {
                await this.auditLogService.log('auth.password_reset.error', 'auth', email, JSON.stringify({ error: error.message }));
                return;
            }
            await this.auditLogService.log('auth.password_reset.request', 'auth', email, JSON.stringify({ status: 'success' }));
        }
        catch (error) {
            await this.auditLogService.log('auth.password_reset.error', 'auth', email, JSON.stringify({ error: error.message }));
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SUPABASE_CLIENT')),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient,
        audit_log_service_1.AuditLogService])
], AuthService);
//# sourceMappingURL=auth.service.js.map