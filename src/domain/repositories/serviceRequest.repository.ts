import { ServiceRequest } from '../entities/serviceRequest.entity';
import { ServiceRequestStatusEnum } from '../entities/enums/status.enum';

export const SERVICE_REQUEST_REPOSITORY = Symbol('ServiceRequestRepository');

export interface ServiceRequestRepository {
  save(serviceRequest: ServiceRequest): Promise<ServiceRequest>;
  findById(id: string): Promise<ServiceRequest | null>;
  findByClientId(clientId: string): Promise<ServiceRequest[]>;
  findByProviderId(providerId: string): Promise<ServiceRequest[]>;
  findByServiceId(serviceId: string): Promise<ServiceRequest[]>;
  findByStatus(status: ServiceRequestStatusEnum): Promise<ServiceRequest[]>;
  findPendingRequests(): Promise<ServiceRequest[]>;
  findPendingRequestsOlderThan48Hours(): Promise<ServiceRequest[]>;
  update(
    id: string,
    serviceRequest: Partial<ServiceRequest>,
  ): Promise<ServiceRequest>;
  delete(id: string): Promise<void>;
  findAll(): Promise<ServiceRequest[]>;
}
