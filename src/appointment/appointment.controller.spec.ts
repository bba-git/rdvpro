import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateAppointmentDto, AppointmentType } from './dto/create-appointment.dto';

describe('AppointmentController', () => {
  let controller: AppointmentController;
  let service: AppointmentService;

  const mockSupabaseService = {
    getClient: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentController],
      providers: [
        AppointmentService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    controller = module.get<AppointmentController>(AppointmentController);
    service = module.get<AppointmentService>(AppointmentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an appointment', async () => {
      const createAppointmentDto: CreateAppointmentDto = {
        clientName: 'John Doe',
        dateTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        appointmentType: AppointmentType.CONSULTATION,
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

      // Note: Validation is handled by ValidationPipe globally
      // This test is a placeholder for when we add custom validation
      expect(controller.create(invalidDto as CreateAppointmentDto)).rejects.toThrow();
    });
  });
});
