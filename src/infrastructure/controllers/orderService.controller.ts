import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderServiceService } from 'src/application/services/orderService/orderService.service';
import { CreateOrderServiceDto } from '../../application/dtos/orderService/create-orderService.dto';
import { UpdateOrderServiceDto } from '../../application/dtos/orderService/update-orderService.dto';
import { ReadOrderServiceDto } from '../../application/dtos/orderService/read-orderService.dto';

@Controller('/api/v1/order-services')
export class OrderServiceController {
  constructor(private readonly orderServiceService: OrderServiceService) {}

  @Post()
  create(@Body() createOrderServiceDto: CreateOrderServiceDto) {
    return this.orderServiceService.create(createOrderServiceDto);
  }

  @Get()
  findAll(): Promise<ReadOrderServiceDto[]> {
    return this.orderServiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ReadOrderServiceDto | null> {
    return this.orderServiceService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderServiceDto: UpdateOrderServiceDto,
  ) {
    return this.orderServiceService.update(id, updateOrderServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.orderServiceService.remove(id);
  }
}
