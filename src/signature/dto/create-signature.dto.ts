import { IsString } from 'class-validator';

export class CreateSignatureDto {
  @IsString()
  name: string;
} 