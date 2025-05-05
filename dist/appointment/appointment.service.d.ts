import { SupabaseClient } from '@supabase/supabase-js';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    createAppointment(createAppointmentDto: CreateAppointmentDto): Promise<any>;
}
