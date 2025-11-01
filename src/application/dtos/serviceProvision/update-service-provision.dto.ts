import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceProvisionDto } from './create-service-provision.dto';

export class UpdateServiceProvisionDto extends PartialType(
  CreateServiceProvisionDto,
) {}
