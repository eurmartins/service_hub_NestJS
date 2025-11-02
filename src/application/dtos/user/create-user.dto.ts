import { IsEmail, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  HashPassword: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
