import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async createAppointment(createAppointmentDto: CreateAppointmentDto) {
    const appointmentDate = new Date(createAppointmentDto.dateTime);
    const now = new Date();

    if (appointmentDate <= now) {
      await this.supabase.from('audit_log').insert({
        action: 'appointment.validation_failed',
        entity: 'appointment',
        details: {
          error: 'Appointment date must be in the future',
          data: createAppointmentDto,
        },
      });
      throw new BadRequestException('Appointment date must be in the future');
    }

    try {
      const { data, error } = await this.supabase
        .from('appointments')
        .insert(createAppointmentDto)
        .select()
        .single();

      if (error) {
        await this.supabase.from('audit_log').insert({
          action: 'appointment.creation_failed',
          entity: 'appointment',
          details: {
            error: error.message,
            data: createAppointmentDto,
          },
        });
        throw new Error(error.message);
      }

      await this.supabase.from('audit_log').insert({
        action: 'appointment.created',
        entity: 'appointment',
        entity_id: data.id,
        details: createAppointmentDto,
      });

      return data;
    } catch (error) {
      await this.supabase.from('audit_log').insert({
        action: 'appointment.creation_failed',
        entity: 'appointment',
        details: {
          error: error.message,
          data: createAppointmentDto,
        },
      });
      throw error;
    }
  }
}
