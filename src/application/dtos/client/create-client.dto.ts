import { IsString, IsUUID } from 'class-validator';

export class CreateClientDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;
}
