import { IsEnum } from 'class-validator';
import { OrderStatusEnum } from '../../../domain/entities/enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'New order status',
    enum: OrderStatusEnum,
    example: 'pending',
  })
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;
}
