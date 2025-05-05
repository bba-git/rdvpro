import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppointmentModule } from './appointment/appointment.module';
import { SignatureModule } from './signature/signature.module';
import { SupabaseModule } from './supabase/supabase.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 👈 makes env config available globally
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    AppointmentModule,
    SignatureModule,
    SupabaseModule,
  ],
})
export class AppModule {}
