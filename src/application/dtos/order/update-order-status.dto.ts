import { IsEnum } from 'class-validator';
import { OrderStatusEnum } from '../../../domain/entities/enums/status.enum';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;
}
