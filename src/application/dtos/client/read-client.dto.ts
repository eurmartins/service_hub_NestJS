import { IsDefined, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ReadUserDto } from '../user/read-user.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ReadClientDto {
  @ApiProperty({
    description: 'Client unique identifier',
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
    description: 'Client name',
    example: 'John Smith',
  })
  @IsString()
  name: string;
}
