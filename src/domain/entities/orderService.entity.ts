import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StatusEnum } from './enums/status.enum';
import { Provider } from './provider.entity';
import { Title } from '../values-objects/orderService.values-objects/title.values-objects';
import { Description } from '../values-objects/orderService.values-objects/description.values-objects';
import { Price } from '../values-objects/orderService.values-objects/price.values-objects';

@Entity()
export class OrderService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  private _title: string;

  @Column()
  private _description: string;

  @Column('decimal')
  private _price: number;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @Column('uuid')
  providerId: string;

  @ManyToOne(() => Provider)
  @JoinColumn({ name: 'providerId' })
  provider: Provider;

  get title(): Title {
    return new Title(this._title);
  }

  set title(title: Title) {
    this._title = title.toString();
  }

  get description(): Description {
    return new Description(this._description);
  }

  set description(description: Description) {
    this._description = description.toString();
  }

  get price(): Price {
    return Price.parseStringToDouble(this._price);
  }

  set price(price: Price) {
    this._price = price.toNumber();
  }
}
