"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const appointment_service_1 = require("./appointment.service");
const supabase_service_1 = require("../supabase/supabase.service");
const create_appointment_dto_1 = require("./dto/create-appointment.dto");
describe('AppointmentService', () => {
    let service;
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
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('createAppointment', () => {
        const createValidAppointmentDto = (type) => ({
            clientName: 'John Doe',
            dateTime: new Date(Date.now() + 86400000).toISOString(),
            appointmentType: type,
        });
        const appointmentTypes = [
            create_appointment_dto_1.AppointmentType.CONSULTATION,
            create_appointment_dto_1.AppointmentType.SIGNATURE,
            create_appointment_dto_1.AppointmentType.DELIVERY,
            create_appointment_dto_1.AppointmentType.ADMINISTRATIVE,
            create_appointment_dto_1.AppointmentType.URGENT_SIGNATURE,
        ];
        it.each(appointmentTypes)('should create a %s appointment successfully', async (type) => {
            const validAppointmentDto = createValidAppointmentDto(type);
            const mockSupabaseClient = {
                from: jest.fn().mockReturnThis(),
                insert: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: Object.assign(Object.assign({}, validAppointmentDto), { id: '123' }), error: null }),
            };
            mockSupabaseService.getClient.mockReturnValue(mockSupabaseClient);
            const result = await service.createAppointment(validAppointmentDto);
            expect(result).toEqual(Object.assign(Object.assign({}, validAppointmentDto), { id: '123' }));
            expect(mockSupabaseClient.from).toHaveBeenCalledWith('appointments');
            expect(mockSupabaseClient.insert).toHaveBeenCalledWith(validAppointmentDto);
            expect(mockSupabaseClient.select).toHaveBeenCalled();
            expect(mockSupabaseClient.single).toHaveBeenCalled();
            expect(mockSupabaseClient.from).toHaveBeenCalledWith('audit_log');
            expect(mockSupabaseClient.insert).toHaveBeenCalledWith({
                action: 'appointment.created',
                entity: 'appointment',
                entity_id: '123',
                details: validAppointmentDto,
            });
        });
        it('should log validation failure for past date', async () => {
            const invalidAppointmentDto = Object.assign(Object.assign({}, createValidAppointmentDto(create_appointment_dto_1.AppointmentType.CONSULTATION)), { dateTime: new Date(Date.now() - 86400000).toISOString() });
            const mockSupabaseClient = {
                from: jest.fn().mockReturnThis(),
                insert: jest.fn().mockReturnThis(),
            };
            mockSupabaseService.getClient.mockReturnValue(mockSupabaseClient);
            await expect(service.createAppointment(invalidAppointmentDto)).rejects.toThrow('Appointment date must be in the future');
            expect(mockSupabaseClient.from).toHaveBeenCalledWith('audit_log');
            expect(mockSupabaseClient.insert).toHaveBeenCalledWith({
                action: 'appointment.validation_failed',
                entity: 'appointment',
                details: {
                    error: 'Appointment date must be in the future',
                    data: invalidAppointmentDto,
                },
            });
        });
        it('should handle and log database errors', async () => {
            const validAppointmentDto = createValidAppointmentDto(create_appointment_dto_1.AppointmentType.CONSULTATION);
            const mockSupabaseClient = {
                from: jest.fn().mockReturnThis(),
                insert: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: null, error: new Error('Database error') }),
            };
            mockSupabaseService.getClient.mockReturnValue(mockSupabaseClient);
            await expect(service.createAppointment(validAppointmentDto)).rejects.toThrow('Database error');
            expect(mockSupabaseClient.from).toHaveBeenCalledWith('audit_log');
            expect(mockSupabaseClient.insert).toHaveBeenCalledWith({
                action: 'appointment.creation_failed',
                entity: 'appointment',
                details: {
                    error: 'Database error',
                    data: validAppointmentDto,
                },
            });
        });
        it('should handle and log unexpected errors', async () => {
            const validAppointmentDto = createValidAppointmentDto(create_appointment_dto_1.AppointmentType.CONSULTATION);
            const mockInsert = jest.fn().mockReturnThis();
            const mockFrom = jest.fn().mockReturnValue({ insert: mockInsert });
            const mockSupabaseClient = {
                from: mockFrom,
            };
            mockSupabaseService.getClient.mockReturnValue(mockSupabaseClient);
            mockFrom.mockImplementationOnce(() => {
                throw new Error('Unexpected error');
            });
            await expect(service.createAppointment(validAppointmentDto)).rejects.toThrow('Unexpected error');
            expect(mockFrom).toHaveBeenCalledWith('audit_log');
            expect(mockInsert).toHaveBeenCalledWith({
                action: 'appointment.creation_failed',
                entity: 'appointment',
                details: {
                    error: 'Unexpected error',
                    data: validAppointmentDto,
                },
            });
        });
    });
});
//# sourceMappingURL=appointment.service.spec.js.map