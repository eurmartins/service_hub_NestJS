import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ServiceRequest } from '../../../domain/entities/serviceRequest.entity';
import { CreateServiceRequestDto } from '../../dtos/serviceRequest/create-service-request.dto';
import { ReadServiceRequestDto } from '../../dtos/serviceRequest/read-service-request.dto';
import { AppLoggerService } from '../logger/logger.service';
import type { ServiceRequestRepository } from '../../../domain/repositories/serviceRequest.repository';
import { SERVICE_REQUEST_REPOSITORY } from '../../../domain/repositories/serviceRequest.repository';
import type { ServiceProvisionRepository } from '../../../domain/repositories/serviceProvision.repository';
import { SERVICE_PROVISION_REPOSITORY } from '../../../domain/repositories/serviceProvision.repository';
import {
  StatusEnum,
  ServiceRequestStatusEnum,
} from '../../../domain/entities/enums/status.enum';
import { ChargedAmount } from '../../../domain/values-objects/serviceRequest.values-objects/chargedAmount.values-objects';

@Injectable()
export class ServiceRequestService {
  constructor(
    @Inject(SERVICE_REQUEST_REPOSITORY)
    private readonly serviceRequestRepository: ServiceRequestRepository,
    @Inject(SERVICE_PROVISION_REPOSITORY)
    private readonly serviceProvisionRepository: ServiceProvisionRepository,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(ServiceRequestService.name);
  }

  async create(
    createServiceRequestDto: CreateServiceRequestDto,
  ): Promise<ServiceRequest> {
    try {
      this.logger.info('Creating service request');

      const serviceProvision = await this.serviceProvisionRepository.findById(
        createServiceRequestDto.serviceId,
      );

      if (!serviceProvision) {
        throw new BadRequestException('Service not found');
      }

      if (serviceProvision.status !== StatusEnum.ACTIVE) {
        throw new BadRequestException(
          'Service must be ACTIVE to be contracted',
        );
      }

      const serviceRequest = new ServiceRequest();
      serviceRequest.clientId = createServiceRequestDto.clientId;
      serviceRequest.serviceId = createServiceRequestDto.serviceId;
      serviceRequest.providerId = createServiceRequestDto.providerId;
      serviceRequest.chargedAmount = ChargedAmount.create(
        createServiceRequestDto.chargedAmount,
      );
      const savedServiceRequest =
        await this.serviceRequestRepository.save(serviceRequest);

      this.logger.info(
        `Service request created with ID: ${savedServiceRequest.id}`,
      );

      return savedServiceRequest;
    } catch (error) {
      this.logger.error('Error creating service request');
      throw error;
    }
  }

  async findAll(): Promise<ReadServiceRequestDto[]> {
    try {
      this.logger.info('Fetching all service requests');

      const serviceRequests = await this.serviceRequestRepository.findAll();

      this.logger.info(`Found ${serviceRequests.length} service requests`);

      return serviceRequests.map((sr) => this.mapToReadDto(sr));
    } catch (error) {
      this.logger.error('Error fetching all service requests');
      throw error;
    }
  }

  async findOne(id: string): Promise<ReadServiceRequestDto | null> {
    try {
      this.logger.info(`Fetching service request with ID: ${id}`);

      const serviceRequest = await this.serviceRequestRepository.findById(id);

      if (serviceRequest) {
        this.logger.info(`Service request found: ${serviceRequest.id}`);
        return this.mapToReadDto(serviceRequest);
      } else {
        this.logger.error(`Service request with ID ${id} not found`);
        return null;
      }
    } catch (error) {
      this.logger.error(`Error fetching service request with ID ${id}`);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.info(`Deleting service request with ID: ${id}`);

      await this.serviceRequestRepository.delete(id);

      this.logger.info('Service request deleted');
    } catch (error) {
      this.logger.error(`Error deleting service request with ID ${id}`);
      throw error;
    }
  }

  async updateStatus(
    id: string,
    newStatus: ServiceRequestStatusEnum,
  ): Promise<ServiceRequest> {
    try {
      this.logger.info(
        `Updating status of service request with ID: ${id} to ${newStatus}`,
      );

      const serviceRequest = await this.serviceRequestRepository.findById(id);

      if (!serviceRequest) {
        throw new BadRequestException('Service request not found');
      }

      serviceRequest.updateStatus(newStatus);

      const updatedServiceRequest =
        await this.serviceRequestRepository.save(serviceRequest);

      this.logger.info(
        `Service request status updated: ${updatedServiceRequest.id}`,
      );

      return updatedServiceRequest;
    } catch (error) {
      this.logger.error(
        `Error updating status of service request with ID ${id}`,
      );
      throw error;
    }
  }

  private mapToReadDto(serviceRequest: ServiceRequest): ReadServiceRequestDto {
    return {
      id: serviceRequest.id,
      clientId: serviceRequest.clientId,
      serviceId: serviceRequest.serviceId,
      providerId: serviceRequest.providerId,
      chargedAmount: serviceRequest.chargedAmount.toNumber(),
      status: serviceRequest.status,
      createdAt: serviceRequest.createdAt,
      completedAt: serviceRequest.completedAt,
      client:
        serviceRequest.client && serviceRequest.client.user
          ? {
              id: serviceRequest.client.id,
              name: serviceRequest.client.name,
              user: {
                id: serviceRequest.client.user.id,
                email: serviceRequest.client.user.email.toString(),
                ativo: serviceRequest.client.user.ativo,
              },
            }
          : undefined,
      service:
        serviceRequest.service &&
        serviceRequest.service.provider &&
        serviceRequest.service.provider.user
          ? {
              id: serviceRequest.service.id,
              title: serviceRequest.service.title.toString(),
              description: serviceRequest.service.description.toString(),
              price: serviceRequest.service.price.toNumber(),
              status: serviceRequest.service.status,
              providerId: serviceRequest.service.providerId,
              provider: {
                id: serviceRequest.service.provider.id,
                name: serviceRequest.service.provider.name,
                prof_description:
                  serviceRequest.service.provider.prof_description.value,
                user: {
                  id: serviceRequest.service.provider.user.id,
                  email: serviceRequest.service.provider.user.email.toString(),
                  ativo: serviceRequest.service.provider.user.ativo,
                },
              },
            }
          : undefined,
      provider:
        serviceRequest.provider && serviceRequest.provider.user
          ? {
              id: serviceRequest.provider.id,
              name: serviceRequest.provider.name,
              prof_description: serviceRequest.provider.prof_description.value,
              user: {
                id: serviceRequest.provider.user.id,
                email: serviceRequest.provider.user.email.toString(),
                ativo: serviceRequest.provider.user.ativo,
              },
            }
          : undefined,
    };
  }
}
