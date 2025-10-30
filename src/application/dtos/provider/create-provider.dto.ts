import { IsString, IsUUID } from 'class-validator';

export class CreateProviderDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  prof_description: string;
}
