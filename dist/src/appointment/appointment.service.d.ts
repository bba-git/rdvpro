import { SupabaseService } from '../supabase/supabase.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    createAppointment(createAppointmentDto: CreateAppointmentDto): Promise<any>;
}
