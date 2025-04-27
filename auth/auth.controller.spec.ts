import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuditLogService } from '../supabase/audit-log.service';

describe('AuthController (Integration)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let auditLogService: AuditLogService;

  const mockSupabase = {
    auth: {
      signInWithPassword: jest.fn(),
      resetPasswordForEmail: jest.fn(),
    },
  };

  const mockAuditLog = {
    log: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
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

    app = moduleFixture.createNestApplication();
    // Enable validation pipe for DTO validation
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    auditLogService = moduleFixture.get<AuditLogService>(AuditLogService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('should return access token when credentials are valid', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        session: { access_token: 'valid_token_123' },
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockUser.session },
        error: null,
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'valid_password',
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        access_token: 'valid_token_123',
      });

      expect(mockAuditLog.log).toHaveBeenCalledWith(
        'auth.login.success',
        mockUser.id,
        'success',
        'auth',
        { email: mockUser.email },
      );
    });

    it('should return 401 when credentials are invalid', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' },
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrong_password',
        })
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body.message).toBe('Invalid credentials');

      expect(mockAuditLog.log).toHaveBeenCalledWith(
        'auth.login.failure',
        'anonymous',
        'fail',
        'auth',
        { email: 'test@example.com', error: 'Invalid login credentials' },
      );
    });

    it('should return 400 when email is invalid', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled();
    });

    it('should return 400 when password is too short', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: '12345', // Less than 6 characters
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled();
    });

    it('should return 400 when required fields are missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);

      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled();
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('should return 202 for valid email', async () => {
      const email = 'test@example.com';
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null });

      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email })
        .expect(HttpStatus.ACCEPTED);

      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(email);
      expect(mockAuditLog.log).toHaveBeenCalledWith(
        'auth.password_reset.request',
        email,
        'success',
        'auth',
        { email },
      );
    });

    it('should return 202 even when email does not exist', async () => {
      const email = 'nonexistent@example.com';
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        data: null,
        error: { message: 'User not found' },
      });

      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email })
        .expect(HttpStatus.ACCEPTED);

      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(email);
      expect(mockAuditLog.log).toHaveBeenCalledWith(
        'auth.password_reset.error',
        email,
        'error',
        'auth',
        { email, error: 'User not found' },
      );
    });

    it('should return 400 for invalid email format', async () => {
      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: 'invalid-email' })
        .expect(HttpStatus.BAD_REQUEST);

      expect(mockSupabase.auth.resetPasswordForEmail).not.toHaveBeenCalled();
    });

    it('should return 400 when email is missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);

      expect(mockSupabase.auth.resetPasswordForEmail).not.toHaveBeenCalled();
    });
  });
}); 