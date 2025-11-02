import { IsEnum } from 'class-validator';
import { ServiceRequestStatusEnum } from '../../../domain/entities/enums/status.enum';

export class UpdateServiceRequestStatusDto {
  @IsEnum(ServiceRequestStatusEnum)
  status: ServiceRequestStatusEnum;
}
