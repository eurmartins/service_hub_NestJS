import {
  IsUUID,
  ValidateNested,
  IsEnum,
  IsNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatusEnum } from '../../../domain/entities/enums/status.enum';
import { ReadClientDto } from '../client/read-client.dto';
import { ReadProviderDto } from '../provider/read-provider.dto';
import { ReadOrderServiceDto } from '../orderService/read-orderService.dto';

export class ReadOrderDto {
  @IsUUID()
  id: string;

  @IsUUID()
  clientId: string;

  @IsUUID()
  serviceId: string;

  @IsUUID()
  providerId: string;

  @IsNumber()
  chargedAmount: number;

  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

  @IsDateString()
  createdAt: Date;

  @IsOptional()
  @IsDateString()
  completedAt?: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReadClientDto)
  client?: ReadClientDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReadOrderServiceDto)
  service?: ReadOrderServiceDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReadProviderDto)
  provider?: ReadProviderDto;
}
