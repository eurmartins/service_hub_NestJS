import { ServiceProvision } from '../entities/serviceProvision.entity';
import { StatusEnum } from '../entities/enums/status.enum';

export const SERVICE_PROVISION_REPOSITORY = Symbol(
  'ServiceProvisionRepository',
);

export interface ServiceProvisionRepository {
  save(serviceProvision: ServiceProvision): Promise<ServiceProvision>;
  findById(id: string): Promise<ServiceProvision | null>;
  findByProviderId(providerId: string): Promise<ServiceProvision[]>;
  findByStatus(status: StatusEnum): Promise<ServiceProvision[]>;
  update(
    id: string,
    serviceProvision: Partial<ServiceProvision>,
  ): Promise<ServiceProvision>;
  delete(id: string): Promise<void>;
  findAll(): Promise<ServiceProvision[]>;
}
