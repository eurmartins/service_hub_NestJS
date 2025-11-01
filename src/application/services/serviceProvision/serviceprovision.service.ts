import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { ServiceProvision } from 'src/domain/entities/serviceProvision.entity';
import { AppLoggerService } from '../logger/logger.service';
import { CreateServiceProvisionDto } from 'src/application/dtos/serviceProvision/create-service-provision.dto';
import { ReadServiceProvisionDto } from 'src/application/dtos/serviceProvision/read-service-provision.dto';
import { UpdateServiceProvisionDto } from 'src/application/dtos/serviceProvision/update-service-provision.dto';
import { Title } from 'src/domain/values-objects/serviceProvision.values-objects/title.values-objects';
import { Description } from 'src/domain/values-objects/serviceProvision.values-objects/description.values-objects';
import { Price } from 'src/domain/values-objects/serviceProvision.values-objects/price.values-objects';
import type { ServiceProvisionRepository } from 'src/domain/repositories/serviceProvision.repository';
import { SERVICE_PROVISION_REPOSITORY } from 'src/domain/repositories/serviceProvision.repository';
import type { ProviderRepository } from 'src/domain/repositories/provider.repository';
import { PROVIDER_REPOSITORY } from 'src/domain/repositories/provider.repository';

@Injectable()
export class ServiceProvisionService {
  constructor(
    @Inject(SERVICE_PROVISION_REPOSITORY)
    private readonly serviceProvisionRepository: ServiceProvisionRepository,
    @Inject(PROVIDER_REPOSITORY)
    private readonly providerRepository: ProviderRepository,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(ServiceProvisionService.name);
  }

  async create(
    createServiceProvisionDto: CreateServiceProvisionDto,
  ): Promise<ServiceProvision> {
    try {
      this.logger.info(
        `Creating service provision with title: ${createServiceProvisionDto.title}`,
      );

      const provider = await this.providerRepository.findById(
        createServiceProvisionDto.providerId,
      );

      if (!provider) {
        throw new BadRequestException('Provider not found');
      }

      const serviceProvision = new ServiceProvision();
      serviceProvision.title = new Title(createServiceProvisionDto.title);
      serviceProvision.description = new Description(
        createServiceProvisionDto.description,
      );
      serviceProvision.price = new Price(createServiceProvisionDto.price);
      serviceProvision.providerId = createServiceProvisionDto.providerId;

      if (createServiceProvisionDto.status) {
        serviceProvision.status = createServiceProvisionDto.status;
      }

      const savedServiceProvision =
        await this.serviceProvisionRepository.save(serviceProvision);

      this.logger.info(
        `Service provision created with ID: ${savedServiceProvision.id}`,
      );

      return savedServiceProvision;
    } catch (error) {
      this.logger.error(
        `Error creating service provision with title: ${createServiceProvisionDto.title}`,
      );
      throw error;
    }
  }

  async findAll(): Promise<ReadServiceProvisionDto[]> {
    try {
      this.logger.info('Fetching all service provisions');

      const serviceProvisions = await this.serviceProvisionRepository.findAll();

      this.logger.info(`Found ${serviceProvisions.length} service provisions`);

      return serviceProvisions.map((sp) => ({
        id: sp.id,
        title: sp.title.toString(),
        description: sp.description.toString(),
        price: sp.price.toNumber(),
        status: sp.status,
        providerId: sp.providerId,
        provider: {
          id: sp.provider.id,
          user: {
            id: sp.provider.user.id,
            email: sp.provider.user.email.toString(),
            ativo: sp.provider.user.ativo,
          },
          name: sp.provider.name,
          prof_description: sp.provider.prof_description.value,
        },
      }));
    } catch (error) {
      this.logger.error(
        `Error fetching all service provisions. Error details: ${error}`,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<ReadServiceProvisionDto | null> {
    try {
      this.logger.info(`Fetching service provision with ID: ${id}`);

      const serviceProvision =
        await this.serviceProvisionRepository.findById(id);

      if (!serviceProvision) {
        this.logger.error(`Service provision not found with ID: ${id}`);
        return null;
      }

      this.logger.info(
        `Service provision found: ${serviceProvision.title.toString()}`,
      );

      return {
        id: serviceProvision.id,
        title: serviceProvision.title.toString(),
        description: serviceProvision.description.toString(),
        price: serviceProvision.price.toNumber(),
        status: serviceProvision.status,
        providerId: serviceProvision.providerId,
        provider: {
          id: serviceProvision.provider.id,
          user: {
            id: serviceProvision.provider.user.id,
            email: serviceProvision.provider.user.email.toString(),
            ativo: serviceProvision.provider.user.ativo,
          },
          name: serviceProvision.provider.name,
          prof_description: serviceProvision.provider.prof_description.value,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error fetching service provision with ID ${id}. Error: ${error}`,
      );
      throw error;
    }
  }

  async update(
    id: string,
    updateServiceProvisionDto: UpdateServiceProvisionDto,
  ): Promise<ServiceProvision | null> {
    try {
      this.logger.info(`Updating service provision with ID: ${id}`);

      const serviceProvision =
        await this.serviceProvisionRepository.findById(id);

      if (!serviceProvision) {
        return null;
      }

      if (updateServiceProvisionDto.title) {
        serviceProvision.title = new Title(updateServiceProvisionDto.title);
      }

      if (updateServiceProvisionDto.description) {
        serviceProvision.description = new Description(
          updateServiceProvisionDto.description,
        );
      }

      if (updateServiceProvisionDto.price) {
        serviceProvision.price = new Price(updateServiceProvisionDto.price);
      }

      if (updateServiceProvisionDto.providerId) {
        const provider = await this.providerRepository.findById(
          updateServiceProvisionDto.providerId,
        );

        if (!provider) {
          throw new BadRequestException('Provider not found');
        }

        serviceProvision.providerId = updateServiceProvisionDto.providerId;
      }

      if (updateServiceProvisionDto.status) {
        serviceProvision.status = updateServiceProvisionDto.status;
      }

      const updatedServiceProvision =
        await this.serviceProvisionRepository.update(id, serviceProvision);

      this.logger.info(
        `Service provision updated: ${updatedServiceProvision.title.toString()}`,
      );

      return updatedServiceProvision;
    } catch (error) {
      this.logger.error(
        `Error updating service provision with ID ${id}. Error: ${error}`,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.info(`Deleting service provision with ID: ${id}`);

      await this.serviceProvisionRepository.delete(id);

      this.logger.info(`Service provision deleted with ID: ${id}`);
    } catch (error) {
      this.logger.error(
        `Error deleting service provision with ID ${id}. Error: ${error}`,
      );
      throw error;
    }
  }
}
