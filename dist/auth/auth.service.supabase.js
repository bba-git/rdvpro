"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const audit_log_service_1 = require("../supabase/audit-log.service");
describe('AuthService with Supabase', () => {
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
    it('should sign in with Supabase and return user data', async () => {
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
        expect(result).toEqual(mockUser);
        expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password123',
        });
    });
    it('should handle Supabase error during sign in', async () => {
        mockSupabase.auth.signInWithPassword.mockResolvedValue({
            data: null,
            error: { message: 'Invalid credentials' },
        });
        const result = await service.validateUser('test@example.com', 'wrongpassword');
        expect(result).toBeNull();
        expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'wrongpassword',
        });
    });
    it('should handle network errors during sign in', async () => {
        const error = new Error('Network error');
        mockSupabase.auth.signInWithPassword.mockRejectedValue(error);
        expect(await service.validateUser('test@example.com', 'password123')).toBeNull();
    });
});
//# sourceMappingURL=auth.service.supabase.js.map