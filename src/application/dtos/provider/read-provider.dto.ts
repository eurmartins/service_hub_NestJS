import { IsDefined, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ReadUserDto } from '../user/read-user.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ReadProviderDto {
  @ApiProperty({
    description: 'Provider unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Associated user data',
    type: ReadUserDto,
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => ReadUserDto)
  user: ReadUserDto;

  @ApiProperty({
    description: 'Provider name',
    example: 'Maria Silva',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Professional description of the provider',
    example: 'Cleaning specialist with 10 years of experience',
  })
  @IsString()
  prof_description: string;
}
