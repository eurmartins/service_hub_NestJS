import { IsEnum, IsOptional } from 'class-validator';
import { ServiceRequestStatusEnum } from '../../../domain/entities/enums/status.enum';

export class UpdateServiceRequestDto {
  @IsOptional()
  @IsEnum(ServiceRequestStatusEnum)
  status?: ServiceRequestStatusEnum;
}
