import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuditLogService } from '../supabase/audit-log.service';

interface AuthUser {
  id: string;
  email: string;
  session: {
    access_token: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
    private readonly auditLogService: AuditLogService,
  ) {}

  async validateUser(email: string, password: string): Promise<AuthUser | null> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        await this.auditLogService.log('auth.login.failure', 'anonymous', 'fail', 'auth', {
          email,
          error: error.message,
        });
        return null;
      }

      await this.auditLogService.log('auth.login.success', data.user.id, 'success', 'auth', {
        email,
      });

      return {
        id: data.user.id,
        email: data.user.email,
        session: data.session,
      };
    } catch (error) {
      await this.auditLogService.log('auth.login.error', 'anonymous', 'error', 'auth', {
        email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  async login(user: AuthUser): Promise<{ access_token: string }> {
    return {
      access_token: user.session.access_token,
    };
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email);

      if (error) {
        await this.auditLogService.log('auth.password_reset.error', email, 'error', 'auth', {
          error: error.message,
        });
        return;
      }

      await this.auditLogService.log('auth.password_reset.request', email, 'success', 'auth', {
        email,
      });
    } catch (error) {
      await this.auditLogService.log('auth.password_reset.error', email, 'error', 'auth', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
