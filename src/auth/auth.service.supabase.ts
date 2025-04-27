import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuditLogService } from '../supabase/audit-log.service';

describe('AuthService with Supabase', () => {
  let service: AuthService;

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
