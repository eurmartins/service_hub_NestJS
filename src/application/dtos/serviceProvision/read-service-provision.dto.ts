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

export class ReadServiceProvisionDto {
  @IsUUID()
  id: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsEnum(StatusEnum)
  status: StatusEnum;

  @IsUUID()
  providerId: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => ReadProviderDto)
  provider: ReadProviderDto;
}
