import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuditLogService } from '../../supabase/audit-log.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly auditLogService: AuditLogService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SUPABASE_JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    try {
      // Validate required Supabase JWT claims
      if (!payload.sub || !payload.email) {
        await this.auditLogService.log(
          'auth.jwt.validation.failure',
          'anonymous',
          'fail',
          'auth',
          { reason: 'Missing required claims' }
        );
        throw new UnauthorizedException('Invalid token claims');
      }

      await this.auditLogService.log(
        'auth.jwt.validation.success',
        payload.sub,
        'success',
        'auth',
        { email: payload.email }
      );

      return {
        id: payload.sub,
        email: payload.email,
      };
    } catch (error) {
      await this.auditLogService.log(
        'auth.jwt.validation.error',
        'anonymous',
        'error',
        'auth',
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
      throw new UnauthorizedException('Invalid token');
    }
  }
}
