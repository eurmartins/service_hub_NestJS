import { Order } from '../entities/order.entity';
import { OrderStatusEnum } from '../entities/enums/status.enum';

export const ORDER_REPOSITORY = Symbol('OrderRepository');

export interface OrderRepository {
  save(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByClientId(clientId: string): Promise<Order[]>;
  findByProviderId(providerId: string): Promise<Order[]>;
  findByServiceId(serviceId: string): Promise<Order[]>;
  findByStatus(status: OrderStatusEnum): Promise<Order[]>;
  findPendingRequests(): Promise<Order[]>;
  findPendingRequestsOlderThan48Hours(): Promise<Order[]>;
  update(id: string, order: Partial<Order>): Promise<Order>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Order[]>;
}
