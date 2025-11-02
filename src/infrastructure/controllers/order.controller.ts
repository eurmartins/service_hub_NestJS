import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { OrderService } from '../../application/services/order/order.service';
import { CreateOrderDto } from '../../application/dtos/order/create-order.dto';
import { ReadOrderDto } from '../../application/dtos/order/read-order.dto';
import { UpdateOrderStatusDto } from '../../application/dtos/order/update-order-status.dto';
import { Order } from '../../domain/entities/order.entity';

@Controller('/api/v1/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  async findAll(): Promise<ReadOrderDto[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadOrderDto | null> {
    return this.orderService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.orderService.remove(id);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.orderService.updateStatus(id, updateStatusDto.status);
  }
}
