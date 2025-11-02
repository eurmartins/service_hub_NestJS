import { OrderService } from '../entities/orderService.entity';
import { StatusEnum } from '../entities/enums/status.enum';

export const ORDER_SERVICE_REPOSITORY = Symbol('OrderServiceRepository');

export interface OrderServiceRepository {
  save(orderService: OrderService): Promise<OrderService>;
  findById(id: string): Promise<OrderService | null>;
  findByProviderId(providerId: string): Promise<OrderService[]>;
  findByStatus(status: StatusEnum): Promise<OrderService[]>;
  update(
    id: string,
    orderService: Partial<OrderService>,
  ): Promise<OrderService>;
  delete(id: string): Promise<void>;
  findAll(): Promise<OrderService[]>;
}
