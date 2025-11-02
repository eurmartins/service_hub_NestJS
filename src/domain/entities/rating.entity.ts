import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  BeforeInsert,
  Check,
} from 'typeorm';
import { Client } from './client.entity';
import { Provider } from './provider.entity';
import { Order } from './order.entity';
import { Score } from '../values-objects/rating.values-objects/score';
import { Comment } from '../values-objects/rating.values-objects/comment';

@Entity()
@Check(`"_score" >= 1 AND "_score" <= 5`)
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { unique: true })
  orderId: string;

  @Column('uuid')
  clientId: string;

  @Column('uuid')
  providerId: string;

  @Column('int')
  private _score: number;

  @Column('text', { nullable: true })
  private _comment: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @ManyToOne(() => Provider)
  @JoinColumn({ name: 'providerId' })
  provider: Provider;

  get score(): Score {
    return Score.create(this._score);
  }

  set score(score: Score) {
    this._score = score.toNumber();
  }

  get comment(): Comment | null {
    if (!this._comment) {
      return null;
    }
    return Comment.create(this._comment);
  }

  set comment(comment: Comment | null) {
    this._comment = comment ? comment.toString() : null;
  }

  @BeforeInsert()
  validateScore() {
    if (this._score < 1 || this._score > 5) {
      throw new Error('Score must be between 1 and 5');
    }
  }

  static canRateOrder(orderCompletedAt: Date): boolean {
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const now = new Date();
    const timeSinceCompletion = now.getTime() - orderCompletedAt.getTime();
    return timeSinceCompletion <= thirtyDaysInMs;
  }

  isWithinAllowedPeriod(orderCompletedAt: Date): boolean {
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const timeSinceCompletion =
      this.createdAt.getTime() - orderCompletedAt.getTime();
    return timeSinceCompletion <= thirtyDaysInMs;
  }
}
