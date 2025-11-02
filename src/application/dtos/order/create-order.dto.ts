import { IsUUID, IsNumber, IsPositive } from 'class-validator';

export class CreateOrderDto {
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
