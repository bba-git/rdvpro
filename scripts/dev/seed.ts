import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';
import { SupabaseService } from '../../src/supabase/supabase.service';
import { AuditLogService } from '../../src/supabase/audit-log.service';
import { AppointmentType, CreateAppointmentDto } from '../../src/appointment/dto/create-appointment.dto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const supabaseService = app.get(SupabaseService);
  const auditLogService = app.get(AuditLogService);
  const supabase = supabaseService.getClient();

  try {
    console.log('🌱 Starting database seeding...');

    // Clean up existing data
    console.log('🧹 Cleaning up existing data...');
    await supabase.from('appointments').delete().neq('id', 0);
    await supabase.from('audit_log').delete().neq('id', 0);

    // Create appointments
    console.log('📅 Creating appointments...');
    const appointments: CreateAppointmentDto[] = [
      {
        clientName: 'John Doe',
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        appointmentType: AppointmentType.CONSULTATION,
      },
      {
        clientName: 'Jane Smith',
        dateTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
        appointmentType: AppointmentType.SIGNATURE,
      },
      {
        clientName: 'Bob Wilson',
        dateTime: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 3 days from now
        appointmentType: AppointmentType.URGENT_SIGNATURE,
      },
    ];

    for (const appointment of appointments) {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointment)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create appointment: ${error.message}`);
      }

      console.log(`✅ Created appointment for ${appointment.clientName}`);
    }

    // Create audit logs
    console.log('📝 Creating audit logs...');
    await auditLogService.log(
      'seed.appointments.created',
      'system',
      'success',
      'seed',
      { count: appointments.length }
    );

    await auditLogService.log(
      'seed.database.initialized',
      'system',
      'success',
      'seed',
      { timestamp: new Date().toISOString() }
    );

    console.log('✨ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap(); 