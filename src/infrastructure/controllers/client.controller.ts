import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ClientService } from '../../application/services/client/client.service';
import { CreateClientDto } from '../../application/dtos/client/create-client.dto';
import { UpdateClientDto } from '../../application/dtos/client/update-client.dto';
import { ReadClientDto } from '../../application/dtos/client/read-client.dto';
import { Client } from '../../domain/entities/client.entity';

@Controller('/api/v1/clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientService.create(createClientDto);
  }

  @Get()
  async findAll(): Promise<ReadClientDto[]> {
    return this.clientService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadClientDto | null> {
    return this.clientService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client | null> {
    return this.clientService.update(id, updateClientDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.clientService.remove(id);
  }
}
