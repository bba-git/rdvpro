"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const audit_log_service_1 = require("../supabase/audit-log.service");
describe('AuthService (Supabase)', () => {
    let service;
    let auditLogService;
    const mockSupabase = {
        auth: {
            signInWithPassword: jest.fn(),
        },
    };
    const mockAuditLog = {
        log: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                { provide: 'SUPABASE_CLIENT', useValue: mockSupabase },
                { provide: audit_log_service_1.AuditLogService, useValue: mockAuditLog },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        auditLogService = module.get(audit_log_service_1.AuditLogService);
    });
    it('should return user on successful validation', async () => {
        const mockUser = { id: '1', email: 'test@example.com' };
        mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: { user: mockUser }, error: null });
        const result = await service.validateUser('test@example.com', 'password');
        expect(result).toEqual({ id: mockUser.id, email: mockUser.email });
        expect(mockAuditLog.log).toHaveBeenCalledWith('auth.login.success', mockUser.id, 'success', 'auth');
    });
    it('should return null on login failure', async () => {
        mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: null, error: new Error('Invalid') });
        const result = await service.validateUser('test@example.com', 'wrong');
        expect(result).toBeNull();
        expect(mockAuditLog.log).toHaveBeenCalledWith('auth.login.failure', 'anonymous', 'fail', 'auth');
    });
    it('should return access token on login', async () => {
        const result = await service.login({ session: { access_token: 'token123' } });
        expect(result).toEqual({ access_token: 'token123' });
    });
});
//# sourceMappingURL=auth.service.supabase.js.map