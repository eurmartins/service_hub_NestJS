import { IsDefined, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ReadUserDto } from '../user/read-user.dto';
import { Type } from 'class-transformer';

export class ReadProviderDto {
  @IsUUID()
  id: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => ReadUserDto)
  user: ReadUserDto;

  @IsString()
  name: string;

  @IsString()
  prof_description: string;
}
