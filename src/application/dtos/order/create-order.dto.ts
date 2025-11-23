import { IsUUID, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Client ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  clientId: string;

  @ApiProperty({
    description: 'Service ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  serviceId: string;

  @ApiProperty({
    description: 'Provider ID',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsUUID()
  providerId: string;

  @ApiProperty({
    description: 'Amount charged for the service',
    example: 150.50,
  })
  @IsNumber()
  @IsPositive()
  chargedAmount: number;
}
