import {
  Controller,
  Get,
  Post,
  Body,
  Put,
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
import { ClientService } from '../../application/services/client/client.service';
import { CreateClientDto } from '../../application/dtos/client/create-client.dto';
import { UpdateClientDto } from '../../application/dtos/client/update-client.dto';
import { ReadClientDto } from '../../application/dtos/client/read-client.dto';
import { Client } from '../../domain/entities/client.entity';

@ApiTags('Clients')
@ApiBearerAuth('Bearer')
@Controller('/api/v1/clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ApiOperation({
    summary: 'Create new client',
    description: 'Creates a new client in the system associated with a user',
  })
  @ApiBody({ type: CreateClientDto })
  @ApiResponse({
    status: 201,
    description: 'Client created successfully',
    type: ReadClientDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data',
  })
  @Post()
  async create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientService.create(createClientDto);
  }

  @ApiOperation({
    summary: 'List all clients',
    description: 'Returns a list of all registered clients',
  })
  @ApiResponse({
    status: 200,
    description: 'Client list returned successfully',
    type: [ReadClientDto],
  })
  @Get()
  async findAll(): Promise<ReadClientDto[]> {
    return this.clientService.findAll();
  }

  @ApiOperation({
    summary: 'Get client by ID',
    description: 'Returns the data of a specific client',
  })
  @ApiParam({
    name: 'id',
    description: 'Client unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Client found',
    type: ReadClientDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadClientDto | null> {
    return this.clientService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update client',
    description: 'Updates partial data of a client',
  })
  @ApiParam({
    name: 'id',
    description: 'Client unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdateClientDto })
  @ApiResponse({
    status: 200,
    description: 'Client updated successfully',
    type: ReadClientDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client | null> {
    return this.clientService.update(id, updateClientDto);
  }

  @ApiOperation({
    summary: 'Delete client',
    description: 'Removes a client from the system',
  })
  @ApiParam({
    name: 'id',
    description: 'Client unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Client deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.clientService.remove(id);
  }
}
