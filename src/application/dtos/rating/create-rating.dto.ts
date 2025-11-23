import { IsUUID, IsInt, Min, Max, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({
    description: 'Order ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  orderId: string;

  @ApiProperty({
    description: 'Client ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  clientId: string;

  @ApiProperty({
    description: 'Provider ID',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsUUID()
  providerId: string;

  @ApiProperty({
    description: 'Rating score from 1 to 5',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  score: number;

  @ApiProperty({
    description: 'Comment about the service',
    example: 'Excellent service, very satisfied!',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
