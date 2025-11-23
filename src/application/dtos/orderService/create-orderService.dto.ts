import {
  IsString,
  IsUUID,
  IsEnum,
  IsNumber,
  IsOptional,
  MinLength,
  MaxLength,
  IsPositive,
} from 'class-validator';
import { StatusEnum } from 'src/domain/entities/enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderServiceDto {
  @ApiProperty({
    description: 'Service title (3-100 characters)',
    example: 'Residential Cleaning',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'Detailed service description',
    example: 'Complete house cleaning including floors, windows and furniture',
  })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({
    description: 'Service price',
    example: 150.50,
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Service provider ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  providerId: string;

  @ApiProperty({
    description: 'Service status',
    enum: StatusEnum,
    example: 'active',
    required: false,
  })
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;
}
