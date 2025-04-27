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
        single: jest.fn().mockResolvedValue({ data: { ...validAppointmentDto, id: '123' }, error: null }),
      };

      mockSupabaseService.getClient.mockReturnValue(mockSupabaseClient);

      const result = await service.createAppointment(validAppointmentDto);

      expect(result).toEqual({ ...validAppointmentDto, id: '123' });
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('appointments');
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith(validAppointmentDto);
      expect(mockSupabaseClient.select).toHaveBeenCalled();
      expect(mockSupabaseClient.single).toHaveBeenCalled();

      // Verify audit logging
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('audit_log');
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith({
        action: 'appointment.created',
        entity: 'appointment',
        entity_id: '123',
        details: validAppointmentDto,
      });
    });

    it('should log validation failure for past date', async () => {
      const invalidAppointmentDto: CreateAppointmentDto = {
        ...createValidAppointmentDto(AppointmentType.CONSULTATION),
        dateTime: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      };

      const mockSupabaseClient = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
      };

      mockSupabaseService.getClient.mockReturnValue(mockSupabaseClient);

      await expect(service.createAppointment(invalidAppointmentDto)).rejects.toThrow(
        'Appointment date must be in the future',
      );

      // Verify audit logging
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

      // Verify audit logging
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
      const validAppointmentDto = createValidAppointmentDto(AppointmentType.CONSULTATION);
      const mockInsert = jest.fn().mockReturnThis();
      const mockFrom = jest.fn().mockReturnValue({ insert: mockInsert });
      const mockSupabaseClient = {
        from: mockFrom,
      };

      mockSupabaseService.getClient.mockReturnValue(mockSupabaseClient);

      // First call to from() should throw
      mockFrom.mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });

      await expect(service.createAppointment(validAppointmentDto)).rejects.toThrow(
        'Unexpected error',
      );

      // Verify audit logging
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
