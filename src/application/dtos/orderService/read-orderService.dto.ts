import {
  IsDefined,
  IsString,
  IsUUID,
  ValidateNested,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StatusEnum } from 'src/domain/entities/enums/status.enum';
import { ReadProviderDto } from '../provider/read-provider.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ReadOrderServiceDto {
  @ApiProperty({
    description: 'Service unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Service title',
    example: 'Residential Cleaning',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Detailed service description',
    example: 'Complete house cleaning including floors, windows and furniture',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Service price',
    example: 150.50,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Service status',
    enum: StatusEnum,
    example: 'active',
  })
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @ApiProperty({
    description: 'Provider ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  providerId: string;

  @ApiProperty({
    description: 'Provider data',
    type: ReadProviderDto,
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => ReadProviderDto)
  provider: ReadProviderDto;
}
