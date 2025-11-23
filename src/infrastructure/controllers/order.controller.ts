import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrderService } from '../../application/services/order/order.service';
import { CreateOrderDto } from '../../application/dtos/order/create-order.dto';
import { ReadOrderDto } from '../../application/dtos/order/read-order.dto';
import { UpdateOrderStatusDto } from '../../application/dtos/order/update-order-status.dto';
import { Order } from '../../domain/entities/order.entity';

@ApiTags('Orders')
@ApiBearerAuth('Bearer')
@Controller('/api/v1/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({
    summary: 'Create new order',
    description:
      'Creates a new order in the system associating client, service and provider',
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: ReadOrderDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or IDs not found',
  })
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }

  @ApiOperation({
    summary: 'List all orders',
    description: 'Returns a list of all registered orders',
  })
  @ApiResponse({
    status: 200,
    description: 'Order list returned successfully',
    type: [ReadOrderDto],
  })
  @Get()
  async findAll(): Promise<ReadOrderDto[]> {
    return this.orderService.findAll();
  }

  @ApiOperation({
    summary: 'Get order by ID',
    description: 'Returns the detailed data of a specific order',
  })
  @ApiParam({
    name: 'id',
    description: 'Order unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Order found',
    type: ReadOrderDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadOrderDto | null> {
    return this.orderService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update order status',
    description:
      'Updates the status of an order (pending, in_progress, completed, cancelled)',
  })
  @ApiParam({
    name: 'id',
    description: 'Order unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdateOrderStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
    type: ReadOrderDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.orderService.updateStatus(id, updateStatusDto.status);
  }

  @ApiOperation({
    summary: 'Delete order',
    description: 'Removes an order from the system',
  })
  @ApiParam({
    name: 'id',
    description: 'Order unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Order deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.orderService.remove(id);
  }
}
