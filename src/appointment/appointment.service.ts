import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createAppointment(createAppointmentDto: CreateAppointmentDto) {
    const supabase = this.supabaseService.getClient();
    const appointmentDate = new Date(createAppointmentDto.dateTime);
    const now = new Date();

    if (appointmentDate <= now) {
      // Log validation failure
      await supabase.from('audit_log').insert({
        action: 'appointment.validation_failed',
        entity: 'appointment',
        details: { error: 'Appointment date must be in the future', data: createAppointmentDto },
      });
      throw new BadRequestException('Appointment date must be in the future');
    }

    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert(createAppointmentDto)
        .select()
        .single();

      if (error) {
        // Log database error
        await supabase.from('audit_log').insert({
          action: 'appointment.creation_failed',
          entity: 'appointment',
          details: { error: error.message, data: createAppointmentDto },
        });
        throw new Error(error.message);
      }

      // Log successful creation
      await supabase.from('audit_log').insert({
        action: 'appointment.created',
        entity: 'appointment',
        entity_id: data.id,
        details: createAppointmentDto,
      });

      return data;
    } catch (error) {
      // Log unexpected errors
      await supabase.from('audit_log').insert({
        action: 'appointment.creation_failed',
        entity: 'appointment',
        details: { error: error.message, data: createAppointmentDto },
      });
      throw error;
    }
  }
}
