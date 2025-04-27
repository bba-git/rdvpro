import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from './appointment.service';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentType } from './dto/create-appointment.dto';

describe('AppointmentService', () => {
  let service: AppointmentService;

  const mockSupabaseService = {
    getClient: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAppointment', () => {
    const createValidAppointmentDto = (type: AppointmentType): CreateAppointmentDto => ({
      clientName: 'John Doe',
      dateTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      appointmentType: type,
    });

    const appointmentTypes = [
      AppointmentType.CONSULTATION,
      AppointmentType.SIGNATURE,
      AppointmentType.DELIVERY,
      AppointmentType.ADMINISTRATIVE,
      AppointmentType.URGENT_SIGNATURE,
    ];

    it.each(appointmentTypes)('should create a %s appointment successfully', async (type) => {
      const validAppointmentDto = createValidAppointmentDto(type);
      const mockSupabaseClient = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: validAppointmentDto, error: null }),
      };

      mockSupabaseService.getClient.mockReturnValue(mockSupabaseClient);

      const result = await service.createAppointment(validAppointmentDto);

      expect(result).toEqual(validAppointmentDto);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('appointments');
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith(validAppointmentDto);
      expect(mockSupabaseClient.select).toHaveBeenCalled();
      expect(mockSupabaseClient.single).toHaveBeenCalled();
    });

    it('should throw an error if appointment date is in the past', async () => {
      const invalidAppointmentDto: CreateAppointmentDto = {
        ...createValidAppointmentDto(AppointmentType.CONSULTATION),
        dateTime: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      };

      await expect(service.createAppointment(invalidAppointmentDto)).rejects.toThrow(
        'Appointment date must be in the future',
      );
    });

    it('should handle database errors', async () => {
      const validAppointmentDto = createValidAppointmentDto(AppointmentType.CONSULTATION);
      const mockSupabaseClient = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: new Error('Database error') }),
      };

      mockSupabaseService.getClient.mockReturnValue(mockSupabaseClient);

      await expect(service.createAppointment(validAppointmentDto)).rejects.toThrow(
        'Database error',
      );
    });
  });
});
