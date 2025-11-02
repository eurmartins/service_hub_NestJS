import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  BeforeInsert,
  Check,
} from 'typeorm';
import { OrderStatusEnum } from './enums/status.enum';
import { Client } from './client.entity';
import { Provider } from './provider.entity';
import { OrderService } from './orderService.entity';
import { ChargedAmount } from '../values-objects/order.values-objects/chargedAmount.values-objects';

@Entity()
@Check(`"clientId" != "providerId"`)
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  clientId: string;

  @Column('uuid')
  serviceId: string;

  @Column('uuid')
  providerId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  private _chargedAmount: number;

  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PENDING,
  })
  status: OrderStatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  completedAt?: Date;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @ManyToOne(() => OrderService)
  @JoinColumn({ name: 'serviceId' })
  service: OrderService;

  @ManyToOne(() => Provider)
  @JoinColumn({ name: 'providerId' })
  provider: Provider;

  @BeforeInsert()
  validateClientAndProvider() {
    if (this.clientId === this.providerId) {
      throw new Error('Client ID cannot be equal to Provider ID');
    }
  }

  get chargedAmount(): ChargedAmount {
    return ChargedAmount.fromDatabase(this._chargedAmount);
  }

  set chargedAmount(amount: ChargedAmount) {
    this._chargedAmount = amount.toNumber();
  }

  canBeCancelled(): boolean {
    return this.status === OrderStatusEnum.PENDING;
  }

  canProgressToInProgress(): boolean {
    return this.status === OrderStatusEnum.PENDING;
  }

  canProgressToCompleted(): boolean {
    return this.status === OrderStatusEnum.IN_PROGRESS;
  }

  updateStatus(newStatus: OrderStatusEnum): void {
    const validTransitions: Record<OrderStatusEnum, OrderStatusEnum[]> = {
      [OrderStatusEnum.PENDING]: [
        OrderStatusEnum.IN_PROGRESS,
        OrderStatusEnum.CANCELLED,
      ],
      [OrderStatusEnum.IN_PROGRESS]: [OrderStatusEnum.COMPLETED],
      [OrderStatusEnum.COMPLETED]: [],
      [OrderStatusEnum.CANCELLED]: [],
    };

    if (!validTransitions[this.status].includes(newStatus)) {
      throw new Error(
        `Invalid status transition from ${this.status} to ${newStatus}`,
      );
    }

    this.status = newStatus;

    if (newStatus === OrderStatusEnum.COMPLETED) {
      this.completedAt = new Date();
    }
  }

  isPendingFor48Hours(): boolean {
    if (this.status !== OrderStatusEnum.PENDING) {
      return false;
    }

    const now = new Date();
    const hoursDiff =
      (now.getTime() - this.createdAt.getTime()) / (1000 * 60 * 60);

    return hoursDiff >= 48;
  }

  autoCancel(): void {
    if (this.isPendingFor48Hours()) {
      this.status = OrderStatusEnum.CANCELLED;
    }
  }
}
