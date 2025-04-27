import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createAppointment(createAppointmentDto: CreateAppointmentDto) {
    const appointmentDate = new Date(createAppointmentDto.dateTime);
    const now = new Date();

    if (appointmentDate <= now) {
      throw new BadRequestException('Appointment date must be in the future');
    }

    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('appointments')
      .insert(createAppointmentDto)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Log the creation in audit_log
    await supabase.from('audit_log').insert({
      action: 'appointment.created',
      entity: 'appointment',
      entity_id: data.id,
      details: createAppointmentDto,
    });

    return data;
  }
} 