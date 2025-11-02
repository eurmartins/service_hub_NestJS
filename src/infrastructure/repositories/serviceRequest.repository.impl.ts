import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { ServiceRequest } from '../../domain/entities/serviceRequest.entity';
import { ServiceRequestRepository } from '../../domain/repositories/serviceRequest.repository';
import { ServiceRequestStatusEnum } from '../../domain/entities/enums/status.enum';

@Injectable()
export class ServiceRequestRepositoryImpl implements ServiceRequestRepository {
  constructor(
    @InjectRepository(ServiceRequest)
    private readonly serviceRequestRepository: Repository<ServiceRequest>,
  ) {}

  async save(serviceRequest: ServiceRequest): Promise<ServiceRequest> {
    return this.serviceRequestRepository.save(serviceRequest);
  }

  async findById(id: string): Promise<ServiceRequest | null> {
    return this.serviceRequestRepository.findOne({
      where: { id },
      relations: ['client', 'service', 'provider'],
    });
  }

  async findByClientId(clientId: string): Promise<ServiceRequest[]> {
    return this.serviceRequestRepository.find({
      where: { clientId },
      relations: ['client', 'service', 'provider'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByProviderId(providerId: string): Promise<ServiceRequest[]> {
    return this.serviceRequestRepository.find({
      where: { providerId },
      relations: ['client', 'service', 'provider'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByServiceId(serviceId: string): Promise<ServiceRequest[]> {
    return this.serviceRequestRepository.find({
      where: { serviceId },
      relations: ['client', 'service', 'provider'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(
    status: ServiceRequestStatusEnum,
  ): Promise<ServiceRequest[]> {
    return this.serviceRequestRepository.find({
      where: { status },
      relations: ['client', 'service', 'provider'],
      order: { createdAt: 'DESC' },
    });
  }

  async findPendingRequests(): Promise<ServiceRequest[]> {
    return this.findByStatus(ServiceRequestStatusEnum.PENDING);
  }

  async findPendingRequestsOlderThan48Hours(): Promise<ServiceRequest[]> {
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

    return this.serviceRequestRepository.find({
      where: {
        status: ServiceRequestStatusEnum.PENDING,
        createdAt: LessThan(fortyEightHoursAgo),
      },
      relations: ['client', 'service', 'provider'],
    });
  }

  async update(
    id: string,
    serviceRequest: Partial<ServiceRequest>,
  ): Promise<ServiceRequest> {
    await this.serviceRequestRepository.update(id, serviceRequest);
    const updatedServiceRequest = await this.findById(id);
    if (!updatedServiceRequest) {
      throw new Error(`ServiceRequest with ID ${id} not found after update`);
    }
    return updatedServiceRequest;
  }

  async delete(id: string): Promise<void> {
    await this.serviceRequestRepository.delete(id);
  }

  async findAll(): Promise<ServiceRequest[]> {
    return this.serviceRequestRepository.find({
      relations: ['client', 'service', 'provider'],
      order: { createdAt: 'DESC' },
    });
  }
}
