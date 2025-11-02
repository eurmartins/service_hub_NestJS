import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Order } from '../../domain/entities/order.entity';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { OrderStatusEnum } from '../../domain/entities/enums/status.enum';

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async save(order: Order): Promise<Order> {
    return this.orderRepository.save(order);
  }

  async findById(id: string): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['client', 'service', 'provider'],
    });
  }

  async findByClientId(clientId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { clientId },
      relations: ['client', 'service', 'provider'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByProviderId(providerId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { providerId },
      relations: ['client', 'service', 'provider'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByServiceId(serviceId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { serviceId },
      relations: ['client', 'service', 'provider'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: OrderStatusEnum): Promise<Order[]> {
    return this.orderRepository.find({
      where: { status },
      relations: ['client', 'service', 'provider'],
      order: { createdAt: 'DESC' },
    });
  }

  async findPendingRequests(): Promise<Order[]> {
    return this.findByStatus(OrderStatusEnum.PENDING);
  }

  async findPendingRequestsOlderThan48Hours(): Promise<Order[]> {
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

    return this.orderRepository.find({
      where: {
        status: OrderStatusEnum.PENDING,
        createdAt: LessThan(fortyEightHoursAgo),
      },
      relations: ['client', 'service', 'provider'],
    });
  }

  async update(id: string, order: Partial<Order>): Promise<Order> {
    await this.orderRepository.update(id, order);
    const updatedOrder = await this.findById(id);
    if (!updatedOrder) {
      throw new Error(`Order with ID ${id} not found after update`);
    }
    return updatedOrder;
  }

  async delete(id: string): Promise<void> {
    await this.orderRepository.delete(id);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['client', 'service', 'provider'],
      order: { createdAt: 'DESC' },
    });
  }
}
