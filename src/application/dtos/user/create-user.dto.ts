import { IsEmail, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  hashSenha: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
