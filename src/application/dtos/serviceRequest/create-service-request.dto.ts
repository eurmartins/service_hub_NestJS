import { IsUUID, IsNumber, IsPositive } from 'class-validator';

export class CreateServiceRequestDto {
  @IsUUID()
  clientId: string;

  @IsUUID()
  serviceId: string;

  @IsUUID()
  providerId: string;

  @IsNumber()
  @IsPositive()
  chargedAmount: number;
}
