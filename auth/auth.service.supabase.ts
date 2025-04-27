import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuditLogService } from '../supabase/audit-log.service';
import { SupabaseClient } from '@supabase/supabase-js';

describe('AuthService (Supabase)', () => {
  let service: AuthService;
  let auditLogService: AuditLogService;

  const mockSupabase = {
    auth: {
      signInWithPassword: jest.fn(),
    },
  };

  const mockAuditLog = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: 'SUPABASE_CLIENT', useValue: mockSupabase },
        { provide: AuditLogService, useValue: mockAuditLog },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    auditLogService = module.get<AuditLogService>(AuditLogService);
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
