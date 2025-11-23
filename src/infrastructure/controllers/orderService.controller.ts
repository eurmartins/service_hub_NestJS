import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrderServiceService } from 'src/application/services/orderService/orderService.service';
import { CreateOrderServiceDto } from '../../application/dtos/orderService/create-orderService.dto';
import { UpdateOrderServiceDto } from '../../application/dtos/orderService/update-orderService.dto';
import { ReadOrderServiceDto } from '../../application/dtos/orderService/read-orderService.dto';

@ApiTags('Order Services')
@ApiBearerAuth('Bearer')
@Controller('/api/v1/order-services')
export class OrderServiceController {
  constructor(private readonly orderServiceService: OrderServiceService) {}

  @ApiOperation({
    summary: 'Create new service',
    description: 'Creates a new service that can be offered by a provider',
  })
  @ApiBody({ type: CreateOrderServiceDto })
  @ApiResponse({
    status: 201,
    description: 'Service created successfully',
    type: ReadOrderServiceDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data',
  })
  @Post()
  create(@Body() createOrderServiceDto: CreateOrderServiceDto) {
    return this.orderServiceService.create(createOrderServiceDto);
  }

  @ApiOperation({
    summary: 'List all services',
    description: 'Returns a list of all registered services',
  })
  @ApiResponse({
    status: 200,
    description: 'Service list returned successfully',
    type: [ReadOrderServiceDto],
  })
  @Get()
  findAll(): Promise<ReadOrderServiceDto[]> {
    return this.orderServiceService.findAll();
  }

  @ApiOperation({
    summary: 'Get service by ID',
    description: 'Returns the detailed data of a specific service',
  })
  @ApiParam({
    name: 'id',
    description: 'Service unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Service found',
    type: ReadOrderServiceDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ReadOrderServiceDto | null> {
    return this.orderServiceService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update service',
    description: 'Updates partial data of a service',
  })
  @ApiParam({
    name: 'id',
    description: 'Service unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdateOrderServiceDto })
  @ApiResponse({
    status: 200,
    description: 'Service updated successfully',
    type: ReadOrderServiceDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderServiceDto: UpdateOrderServiceDto,
  ) {
    return this.orderServiceService.update(id, updateOrderServiceDto);
  }

  @ApiOperation({
    summary: 'Delete service',
    description: 'Removes a service from the system',
  })
  @ApiParam({
    name: 'id',
    description: 'Service unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Service deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.orderServiceService.remove(id);
  }
}
