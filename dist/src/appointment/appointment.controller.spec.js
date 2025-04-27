"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const appointment_controller_1 = require("./appointment.controller");
const appointment_service_1 = require("./appointment.service");
const create_appointment_dto_1 = require("./dto/create-appointment.dto");
describe('AppointmentController', () => {
    let controller;
    let service;
    const mockAppointmentService = {
        createAppointment: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [appointment_controller_1.AppointmentController],
            providers: [
                {
                    provide: appointment_service_1.AppointmentService,
                    useValue: mockAppointmentService,
                },
            ],
        }).compile();
        controller = module.get(appointment_controller_1.AppointmentController);
        service = module.get(appointment_service_1.AppointmentService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('createAppointment', () => {
        const validAppointmentDto = {
            clientName: 'John Doe',
            dateTime: new Date(Date.now() + 86400000).toISOString(),
            appointmentType: create_appointment_dto_1.AppointmentType.CONSULTATION,
        };
        it('should create an appointment and return 201', async () => {
            const createdAppointment = Object.assign({ id: 1 }, validAppointmentDto);
            mockAppointmentService.createAppointment.mockResolvedValue(createdAppointment);
            const result = await controller.createAppointment(validAppointmentDto);
            expect(result).toEqual(createdAppointment);
            expect(mockAppointmentService.createAppointment).toHaveBeenCalledWith(validAppointmentDto);
        });
        it('should handle service errors', async () => {
            const error = new Error('Invalid appointment date');
            mockAppointmentService.createAppointment.mockRejectedValue(error);
            await expect(controller.createAppointment(validAppointmentDto)).rejects.toThrow(error);
        });
    });
});
//# sourceMappingURL=appointment.controller.spec.js.map