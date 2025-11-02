import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Order } from '../../../domain/entities/order.entity';
import { CreateOrderDto } from '../../dtos/order/create-order.dto';
import { ReadOrderDto } from '../../dtos/order/read-order.dto';
import { AppLoggerService } from '../logger/logger.service';
import type { OrderRepository } from '../../../domain/repositories/order.repository';
import { ORDER_REPOSITORY } from '../../../domain/repositories/order.repository';
import type { OrderServiceRepository } from '../../../domain/repositories/orderService.repository';
import { ORDER_SERVICE_REPOSITORY } from '../../../domain/repositories/orderService.repository';
import {
  StatusEnum,
  OrderStatusEnum,
} from '../../../domain/entities/enums/status.enum';
import { ChargedAmount } from '../../../domain/values-objects/order.values-objects/chargedAmount.values-objects';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    @Inject(ORDER_SERVICE_REPOSITORY)
    private readonly orderServiceRepository: OrderServiceRepository,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(OrderService.name);
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      this.logger.info('Creating order');

      const orderService = await this.orderServiceRepository.findById(
        createOrderDto.serviceId,
      );

      if (!orderService) {
        throw new BadRequestException('Service not found');
      }

      if (orderService.status !== StatusEnum.ACTIVE) {
        throw new BadRequestException(
          'Service must be ACTIVE to be contracted',
        );
      }

      const order = new Order();
      order.clientId = createOrderDto.clientId;
      order.serviceId = createOrderDto.serviceId;
      order.providerId = createOrderDto.providerId;
      order.chargedAmount = ChargedAmount.create(
        createOrderDto.chargedAmount,
      );
      const savedOrder = await this.orderRepository.save(order);

      this.logger.info(`Order created with ID: ${savedOrder.id}`);

      return savedOrder;
    } catch (error) {
      this.logger.error('Error creating order');
      throw error;
    }
  }

  async findAll(): Promise<ReadOrderDto[]> {
    try {
      this.logger.info('Fetching all orders');

      const orders = await this.orderRepository.findAll();

      this.logger.info(`Found ${orders.length} orders`);

      return orders.map((o) => this.mapToReadDto(o));
    } catch (error) {
      this.logger.error('Error fetching all orders');
      throw error;
    }
  }

  async findOne(id: string): Promise<ReadOrderDto | null> {
    try {
      this.logger.info(`Fetching order with ID: ${id}`);

      const order = await this.orderRepository.findById(id);

      if (order) {
        this.logger.info(`Order found: ${order.id}`);
        return this.mapToReadDto(order);
      } else {
        this.logger.error(`Order with ID ${id} not found`);
        return null;
      }
    } catch (error) {
      this.logger.error(`Error fetching order with ID ${id}`);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.info(`Deleting order with ID: ${id}`);

      await this.orderRepository.delete(id);

      this.logger.info('Order deleted');
    } catch (error) {
      this.logger.error(`Error deleting order with ID ${id}`);
      throw error;
    }
  }

  async updateStatus(
    id: string,
    newStatus: OrderStatusEnum,
  ): Promise<Order> {
    try {
      this.logger.info(
        `Updating status of order with ID: ${id} to ${newStatus}`,
      );

      const order = await this.orderRepository.findById(id);

      if (!order) {
        throw new BadRequestException('Order not found');
      }

      order.updateStatus(newStatus);

      const updatedOrder = await this.orderRepository.save(order);

      this.logger.info(`Order status updated: ${updatedOrder.id}`);

      return updatedOrder;
    } catch (error) {
      this.logger.error(`Error updating status of order with ID ${id}`);
      throw error;
    }
  }

  private mapToReadDto(order: Order): ReadOrderDto {
    return {
      id: order.id,
      clientId: order.clientId,
      serviceId: order.serviceId,
      providerId: order.providerId,
      chargedAmount: order.chargedAmount.toNumber(),
      status: order.status,
      createdAt: order.createdAt,
      completedAt: order.completedAt,
      client:
        order.client && order.client.user
          ? {
              id: order.client.id,
              name: order.client.name,
              user: {
                id: order.client.user.id,
                email: order.client.user.email.toString(),
                ativo: order.client.user.ativo,
              },
            }
          : undefined,
      service:
        order.service &&
        order.service.provider &&
        order.service.provider.user
          ? {
              id: order.service.id,
              title: order.service.title.toString(),
              description: order.service.description.toString(),
              price: order.service.price.toNumber(),
              status: order.service.status,
              providerId: order.service.providerId,
              provider: {
                id: order.service.provider.id,
                name: order.service.provider.name,
                prof_description:
                  order.service.provider.prof_description.value,
                user: {
                  id: order.service.provider.user.id,
                  email: order.service.provider.user.email.toString(),
                  ativo: order.service.provider.user.ativo,
                },
              },
            }
          : undefined,
      provider:
        order.provider && order.provider.user
          ? {
              id: order.provider.id,
              name: order.provider.name,
              prof_description: order.provider.prof_description.value,
              user: {
                id: order.provider.user.id,
                email: order.provider.user.email.toString(),
                ativo: order.provider.user.ativo,
              },
            }
          : undefined,
    };
  }
}
