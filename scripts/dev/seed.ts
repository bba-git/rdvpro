// scripts/dev/seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const supabase = app.get('SUPABASE_CLIENT');
  const config = app.get(ConfigService);

  console.log('🌱 Seeding appointments...');

  const { data, error } = await supabase.from('appointments').insert([
    {
      client_name: 'Alice',
      date_time: new Date(Date.now() + 86400000).toISOString(),
      appointment_type: 'consultation',
    },
  ]);

  if (error) {
    console.error('❌ Failed to insert appointment:', error);
  } else {
    console.log('✅ Appointment inserted:', data);
  }

  await supabase.from('audit_log').insert([
    {
      action: 'seed.insert_appointment',
      entity: 'appointment',
      status: 'info',
      details: {
        note: 'Inserted Alice appointment via seed script',
      },
    },
  ]);

  console.log('✅ Audit log entry added.');
  await app.close();
}

bootstrap();
