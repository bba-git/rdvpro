"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const audit_log_service_1 = require("../supabase/audit-log.service");
describe('AuthService', () => {
    let service;
    const mockSupabase = {
        auth: {
            signInWithPassword: jest.fn(),
            resetPasswordForEmail: jest.fn(),
        },
    };
    const mockAuditLog = {
        log: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: 'SUPABASE_CLIENT',
                    useValue: mockSupabase,
                },
                {
                    provide: audit_log_service_1.AuditLogService,
                    useValue: mockAuditLog,
                },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
    });
    describe('validateUser', () => {
        it('should return user data on successful login', async () => {
            const mockUser = {
                id: '123',
                email: 'test@example.com',
                session: { access_token: 'token123' },
            };
            mockSupabase.auth.signInWithPassword.mockResolvedValue({
                data: { user: mockUser, session: mockUser.session },
                error: null,
            });
            const result = await service.validateUser('test@example.com', 'password123');
            expect(result).toEqual({
                id: mockUser.id,
                email: mockUser.email,
                session: mockUser.session,
            });
            expect(mockAuditLog.log).toHaveBeenCalledWith('auth.login.success', mockUser.id, 'success', 'auth', { email: mockUser.email });
        });
        it('should return null and log failure on invalid credentials', async () => {
            mockSupabase.auth.signInWithPassword.mockResolvedValue({
                data: null,
                error: { message: 'Invalid login credentials' },
            });
            const result = await service.validateUser('test@example.com', 'wrongpassword');
            expect(result).toBeNull();
            expect(mockAuditLog.log).toHaveBeenCalledWith('auth.login.failure', 'anonymous', 'fail', 'auth', { email: 'test@example.com', error: 'Invalid login credentials' });
        });
        it('should handle and log unexpected errors', async () => {
            const error = new Error('Network error');
            mockSupabase.auth.signInWithPassword.mockRejectedValue(error);
            const result = await service.validateUser('test@example.com', 'password123');
            expect(result).toBeNull();
            expect(mockAuditLog.log).toHaveBeenCalledWith('auth.login.error', 'anonymous', 'error', 'auth', { email: 'test@example.com', error: error.message });
        });
    });
    describe('login', () => {
        it('should return access token from user session', async () => {
            const mockUser = {
                id: 'user123',
                email: 'test@example.com',
                session: { access_token: 'token123' },
            };
            const result = await service.login(mockUser);
            expect(result).toEqual({ access_token: 'token123' });
        });
    });
    describe('forgotPassword', () => {
        it('should send reset email and log success for existing email', async () => {
            const email = 'test@example.com';
            mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null });
            await service.forgotPassword(email);
            expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(email);
            expect(mockAuditLog.log).toHaveBeenCalledWith('auth.password_reset.request', email, 'success', 'auth', { email });
        });
        it('should log failure when Supabase returns error', async () => {
            const email = 'test@example.com';
            const error = { message: 'Rate limit exceeded' };
            mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ data: null, error });
            await service.forgotPassword(email);
            expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(email);
            expect(mockAuditLog.log).toHaveBeenCalledWith('auth.password_reset.error', email, 'error', 'auth', { error: error.message });
        });
        it('should handle and log unexpected errors', async () => {
            const email = 'test@example.com';
            const error = new Error('Network error');
            mockSupabase.auth.resetPasswordForEmail.mockRejectedValue(error);
            await service.forgotPassword(email);
            expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(email);
            expect(mockAuditLog.log).toHaveBeenCalledWith('auth.password_reset.error', email, 'error', 'auth', { error: error.message });
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map