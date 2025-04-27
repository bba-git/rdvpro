"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const appointment_service_1 = require("./appointment.service");
const supabase_service_1 = require("../supabase/supabase.service");
const create_appointment_dto_1 = require("./dto/create-appointment.dto");
describe('AppointmentService', () => {
    let service;
    let supabaseService;
    const mockSupabaseService = {
        getClient: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                appointment_service_1.AppointmentService,
                {
                    provide: supabase_service_1.SupabaseService,
                    useValue: mockSupabaseService,
                },
            ],
        }).compile();
        service = module.get(appointment_service_1.AppointmentService);
        supabaseService = module.get(supabase_service_1.SupabaseService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('createAppointment', () => {
        const validAppointmentDto = {
            clientName: 'John Doe',
            dateTime: new Date(Date.now() + 86400000).toISOString(),
            appointmentType: create_appointment_dto_1.AppointmentType.CONSULTATION,
        };
        it('should create an appointment successfully', async () => {
            const mockSupabaseClient = {
                from: jest.fn().mockReturnThis(),
                insert: jest.fn().mockResolvedValue({ data: [validAppointmentDto], error: null }),
            };
            mockSupabaseService.getClient.mockReturnValue(mockSupabaseClient);
            const result = await service.createAppointment(validAppointmentDto);
            expect(result).toEqual(validAppointmentDto);
            expect(mockSupabaseClient.from).toHaveBeenCalledWith('appointments');
            expect(mockSupabaseClient.insert).toHaveBeenCalledWith(validAppointmentDto);
        });
        it('should throw an error if appointment date is in the past', async () => {
            const invalidAppointmentDto = Object.assign(Object.assign({}, validAppointmentDto), { dateTime: new Date(Date.now() - 86400000).toISOString() });
            await expect(service.createAppointment(invalidAppointmentDto)).rejects.toThrow('Appointment date must be in the future');
        });
        it('should handle database errors', async () => {
            const mockSupabaseClient = {
                from: jest.fn().mockReturnThis(),
                insert: jest.fn().mockResolvedValue({ data: null, error: new Error('Database error') }),
            };
            mockSupabaseService.getClient.mockReturnValue(mockSupabaseClient);
            await expect(service.createAppointment(validAppointmentDto)).rejects.toThrow('Database error');
        });
    });
});
//# sourceMappingURL=appointment.service.spec.js.map