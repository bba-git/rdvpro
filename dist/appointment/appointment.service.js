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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
let AppointmentService = class AppointmentService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async createAppointment(createAppointmentDto) {
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
            throw new common_1.BadRequestException('Appointment date must be in the future');
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
        }
        catch (error) {
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
};
exports.AppointmentService = AppointmentService;
exports.AppointmentService = AppointmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SUPABASE_CLIENT')),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient])
], AppointmentService);
//# sourceMappingURL=appointment.service.js.map