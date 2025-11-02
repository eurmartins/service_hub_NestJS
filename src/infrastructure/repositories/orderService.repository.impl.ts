import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderService } from '../../domain/entities/orderService.entity';
import { OrderServiceRepository } from '../../domain/repositories/orderService.repository';
import { StatusEnum } from '../../domain/entities/enums/status.enum';

@Injectable()
export class OrderServiceRepositoryImpl implements OrderServiceRepository {
  constructor(
    @InjectRepository(OrderService)
    private readonly orderServiceRepository: Repository<OrderService>,
  ) {}

  async save(orderService: OrderService): Promise<OrderService> {
    return this.orderServiceRepository.save(orderService);
  }

  async findById(id: string): Promise<OrderService | null> {
    return this.orderServiceRepository.findOne({
      where: { id },
      relations: ['provider', 'provider.user'],
    });
  }

  async findByProviderId(providerId: string): Promise<OrderService[]> {
    return this.orderServiceRepository.find({
      where: { providerId },
      relations: ['provider', 'provider.user'],
    });
  }

  async findByStatus(status: StatusEnum): Promise<OrderService[]> {
    return this.orderServiceRepository.find({
      where: { status },
      relations: ['provider', 'provider.user'],
    });
  }

  async update(
    id: string,
    orderService: Partial<OrderService>,
  ): Promise<OrderService> {
    await this.orderServiceRepository.update(id, orderService);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`OrderService with ID ${id} not found after update`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.orderServiceRepository.delete(id);
  }

  async findAll(): Promise<OrderService[]> {
    return this.orderServiceRepository.find({
      relations: ['provider', 'provider.user'],
    });
  }
}
