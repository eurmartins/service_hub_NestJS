import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceProvision } from '../../domain/entities/serviceProvision.entity';
import { ServiceProvisionRepository } from '../../domain/repositories/serviceProvision.repository';
import { StatusEnum } from '../../domain/entities/enums/status.enum';

@Injectable()
export class ServiceProvisionRepositoryImpl
  implements ServiceProvisionRepository
{
  constructor(
    @InjectRepository(ServiceProvision)
    private readonly serviceProvisionRepository: Repository<ServiceProvision>,
  ) {}

  async save(serviceProvision: ServiceProvision): Promise<ServiceProvision> {
    return this.serviceProvisionRepository.save(serviceProvision);
  }

  async findById(id: string): Promise<ServiceProvision | null> {
    return this.serviceProvisionRepository.findOne({
      where: { id },
      relations: ['provider', 'provider.user'],
    });
  }

  async findByProviderId(providerId: string): Promise<ServiceProvision[]> {
    return this.serviceProvisionRepository.find({
      where: { providerId },
      relations: ['provider', 'provider.user'],
    });
  }

  async findByStatus(status: StatusEnum): Promise<ServiceProvision[]> {
    return this.serviceProvisionRepository.find({
      where: { status },
      relations: ['provider', 'provider.user'],
    });
  }

  async update(
    id: string,
    serviceProvision: Partial<ServiceProvision>,
  ): Promise<ServiceProvision> {
    await this.serviceProvisionRepository.update(id, serviceProvision);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`ServiceProvision with ID ${id} not found after update`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.serviceProvisionRepository.delete(id);
  }

  async findAll(): Promise<ServiceProvision[]> {
    return this.serviceProvisionRepository.find({
      relations: ['provider', 'provider.user'],
    });
  }
}
