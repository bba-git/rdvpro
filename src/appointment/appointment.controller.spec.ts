import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentType } from './dto/create-appointment.dto';

describe('AppointmentController', () => {
  let controller: AppointmentController;
  let service: AppointmentService;

  const mockAppointmentService = {
    createAppointment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentController],
      providers: [
        {
          provide: AppointmentService,
          useValue: mockAppointmentService,
        },
      ],
    }).compile();

    controller = module.get<AppointmentController>(AppointmentController);
    service = module.get<AppointmentService>(AppointmentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAppointment', () => {
    const validAppointmentDto: CreateAppointmentDto = {
      clientName: 'John Doe',
      dateTime: new Date(Date.now() + 86400000).toISOString(),
      appointmentType: AppointmentType.CONSULTATION,
    };

    it('should create an appointment and return 201', async () => {
      const createdAppointment = { id: 1, ...validAppointmentDto };
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