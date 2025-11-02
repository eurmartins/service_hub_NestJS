import {
  IsUUID,
  ValidateNested,
  IsEnum,
  IsNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceRequestStatusEnum } from '../../../domain/entities/enums/status.enum';
import { ReadClientDto } from '../client/read-client.dto';
import { ReadProviderDto } from '../provider/read-provider.dto';
import { ReadServiceProvisionDto } from '../serviceProvision/read-service-provision.dto';

export class ReadServiceRequestDto {
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

  @IsEnum(ServiceRequestStatusEnum)
  status: ServiceRequestStatusEnum;

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
  @Type(() => ReadServiceProvisionDto)
  service?: ReadServiceProvisionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReadProviderDto)
  provider?: ReadProviderDto;
}
