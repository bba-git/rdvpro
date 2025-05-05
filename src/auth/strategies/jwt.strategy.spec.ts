import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { AuditLogService } from '../../supabase/audit-log.service';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;
  let auditLogService: AuditLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
        {
          provide: AuditLogService,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
    auditLogService = module.get<AuditLogService>(AuditLogService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate a valid token payload', async () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
      });
      expect(auditLogService.log).toHaveBeenCalledWith(
        'auth.jwt.validation.success',
        'user-123',
        'success',
        'auth',
        { email: 'test@example.com' }
      );
    });

    it('should throw UnauthorizedException when payload is missing required claims', async () => {
      const payload = {
        sub: 'user-123',
        // email is missing
      };

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      expect(auditLogService.log).toHaveBeenCalledWith(
        'auth.jwt.validation.failure',
        'anonymous',
        'fail',
        'auth',
        { reason: 'Missing required claims' }
      );
    });

    it('should throw UnauthorizedException when payload is invalid', async () => {
      const payload = null;

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      expect(auditLogService.log).toHaveBeenCalledWith(
        'auth.jwt.validation.error',
        'anonymous',
        'error',
        'auth',
        { error: 'Invalid token' }
      );
    });
  });
}); 