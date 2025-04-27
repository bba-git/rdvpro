import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuditLogService } from '../supabase/audit-log.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
    private readonly auditLogService: AuditLogService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        await this.auditLogService.log(
          'auth.login.failure',
          'anonymous',
          'fail',
          'auth',
          { email, error: error.message },
        );
        return null;
      }

      await this.auditLogService.log(
        'auth.login.success',
        data.user.id,
        'success',
        'auth',
        { email },
      );

      return {
        id: data.user.id,
        email: data.user.email,
        session: data.session,
      };
    } catch (error) {
      await this.auditLogService.log(
        'auth.login.error',
        'anonymous',
        'error',
        'auth',
        { email, error: error.message },
      );
      return null;
    }
  }

  async login(user: any): Promise<{ access_token: string }> {
    return {
      access_token: user.session.access_token,
    };
  }
} 