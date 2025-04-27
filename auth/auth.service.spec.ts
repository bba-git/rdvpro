import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuditLogService } from '../supabase/audit-log.service';
import { SupabaseClient } from '@supabase/supabase-js';

describe('AuthService', () => {
  let service: AuthService;
  let auditLogService: AuditLogService;
  let supabaseClient: SupabaseClient;

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
        {
          provide: 'SUPABASE_CLIENT',
          useValue: mockSupabase,
        },
        {
          provide: AuditLogService,
          useValue: mockAuditLog,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    auditLogService = module.get<AuditLogService>(AuditLogService);
    supabaseClient = module.get<SupabaseClient>('SUPABASE_CLIENT');
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

      expect(mockAuditLog.log).toHaveBeenCalledWith(
        'auth.login.success',
        mockUser.id,
        'success',
        'auth',
        { email: mockUser.email },
      );
    });

    it('should return null and log failure on invalid credentials', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' },
      });

      const result = await service.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
      expect(mockAuditLog.log).toHaveBeenCalledWith(
        'auth.login.failure',
        'anonymous',
        'fail',
        'auth',
        { email: 'test@example.com', error: 'Invalid login credentials' },
      );
    });

    it('should handle and log unexpected errors', async () => {
      const error = new Error('Network error');
      mockSupabase.auth.signInWithPassword.mockRejectedValue(error);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toBeNull();
      expect(mockAuditLog.log).toHaveBeenCalledWith(
        'auth.login.error',
        'anonymous',
        'error',
        'auth',
        { email: 'test@example.com', error: error.message },
      );
    });
  });

  describe('login', () => {
    it('should return access token from user session', async () => {
      const mockUser = {
        session: { access_token: 'token123' },
      };

      const result = await service.login(mockUser);

      expect(result).toEqual({ access_token: 'token123' });
    });
  });
}); 