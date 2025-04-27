"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let AppointmentService = class AppointmentService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async createAppointment(createAppointmentDto) {
        const appointmentDate = new Date(createAppointmentDto.dateTime);
        const now = new Date();
        if (appointmentDate <= now) {
            throw new common_1.BadRequestException('Appointment date must be in the future');
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
        await supabase.from('audit_log').insert({
            action: 'appointment.created',
            entity: 'appointment',
            entity_id: data.id,
            details: createAppointmentDto,
        });
        return data;
    }
};
exports.AppointmentService = AppointmentService;
exports.AppointmentService = AppointmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], AppointmentService);
//# sourceMappingURL=appointment.service.js.map