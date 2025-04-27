import { IsString, IsISO8601, IsEnum, IsNotEmpty } from 'class-validator';

export enum AppointmentType {
  CONSULTATION = 'consultation',
  SIGNATURE = 'signature',
  DELIVERY = 'delivery',
}

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsISO8601()
  @IsNotEmpty()
  dateTime: string;

  @IsEnum(AppointmentType)
  @IsNotEmpty()
  appointmentType: AppointmentType;
} 