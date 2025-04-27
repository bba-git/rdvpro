"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const appointment_controller_1 = require("./appointment.controller");
const appointment_service_1 = require("./appointment.service");
const supabase_service_1 = require("../supabase/supabase.service");
const create_appointment_dto_1 = require("./dto/create-appointment.dto");
describe('AppointmentController', () => {
    let controller;
    let service;
    const mockSupabaseService = {
        getClient: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [appointment_controller_1.AppointmentController],
            providers: [
                appointment_service_1.AppointmentService,
                {
                    provide: supabase_service_1.SupabaseService,
                    useValue: mockSupabaseService,
                },
            ],
        }).compile();
        controller = module.get(appointment_controller_1.AppointmentController);
        service = module.get(appointment_service_1.AppointmentService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('create', () => {
        it('should create an appointment', async () => {
            const createAppointmentDto = {
                clientName: 'John Doe',
                dateTime: new Date(Date.now() + 86400000).toISOString(),
                appointmentType: create_appointment_dto_1.AppointmentType.CONSULTATION,
            };
            jest.spyOn(service, 'createAppointment').mockResolvedValue(createAppointmentDto);
            const result = await controller.create(createAppointmentDto);
            expect(result).toEqual(createAppointmentDto);
            expect(service.createAppointment).toHaveBeenCalledWith(createAppointmentDto);
        });
        it('should validate appointment data', async () => {
            const invalidDto = {
                clientName: '',
                dateTime: 'invalid-date',
                appointmentType: 'invalid-type',
            };
            expect(controller.create(invalidDto)).rejects.toThrow();
        });
    });
});
//# sourceMappingURL=appointment.controller.spec.js.map