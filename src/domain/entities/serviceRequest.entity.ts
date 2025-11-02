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
import { ServiceRequestStatusEnum } from './enums/status.enum';
import { Client } from './client.entity';
import { Provider } from './provider.entity';
import { ServiceProvision } from './serviceProvision.entity';
import { ChargedAmount } from '../values-objects/serviceRequest.values-objects/chargedAmount.values-objects';

@Entity()
@Check(`"clientId" != "providerId"`)
export class ServiceRequest {
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
    enum: ServiceRequestStatusEnum,
    default: ServiceRequestStatusEnum.PENDING,
  })
  status: ServiceRequestStatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  completedAt?: Date;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @ManyToOne(() => ServiceProvision)
  @JoinColumn({ name: 'serviceId' })
  service: ServiceProvision;

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
    return this.status === ServiceRequestStatusEnum.PENDING;
  }

  canProgressToInProgress(): boolean {
    return this.status === ServiceRequestStatusEnum.PENDING;
  }

  canProgressToCompleted(): boolean {
    return this.status === ServiceRequestStatusEnum.IN_PROGRESS;
  }

  updateStatus(newStatus: ServiceRequestStatusEnum): void {
    const validTransitions: Record<
      ServiceRequestStatusEnum,
      ServiceRequestStatusEnum[]
    > = {
      [ServiceRequestStatusEnum.PENDING]: [
        ServiceRequestStatusEnum.IN_PROGRESS,
        ServiceRequestStatusEnum.CANCELLED,
      ],
      [ServiceRequestStatusEnum.IN_PROGRESS]: [
        ServiceRequestStatusEnum.COMPLETED,
      ],
      [ServiceRequestStatusEnum.COMPLETED]: [],
      [ServiceRequestStatusEnum.CANCELLED]: [],
    };

    if (!validTransitions[this.status].includes(newStatus)) {
      throw new Error(
        `Invalid status transition from ${this.status} to ${newStatus}`,
      );
    }

    this.status = newStatus;

    if (newStatus === ServiceRequestStatusEnum.COMPLETED) {
      this.completedAt = new Date();
    }
  }

  isPendingFor48Hours(): boolean {
    if (this.status !== ServiceRequestStatusEnum.PENDING) {
      return false;
    }

    const now = new Date();
    const hoursDiff =
      (now.getTime() - this.createdAt.getTime()) / (1000 * 60 * 60);

    return hoursDiff >= 48;
  }

  autoCancel(): void {
    if (this.isPendingFor48Hours()) {
      this.status = ServiceRequestStatusEnum.CANCELLED;
    }
  }
}
