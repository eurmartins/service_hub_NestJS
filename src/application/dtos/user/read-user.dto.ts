import { IsEmail, IsBoolean, IsUUID } from 'class-validator';

export class ReadUserDto {
  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  active: boolean;
}
