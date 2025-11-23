import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProviderDto {
  @ApiProperty({
    description: 'User ID associated with the provider',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  id: string;

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
