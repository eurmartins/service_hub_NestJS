import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProviderService } from '../../application/services/provider/provider.service';
import { CreateProviderDto } from '../../application/dtos/provider/create-provider.dto';
import { UpdateProviderDto } from '../../application/dtos/provider/update-provider.dto';
import { ReadProviderDto } from '../../application/dtos/provider/read-provider.dto';

@Controller('/api/v1/providers')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post()
  create(@Body() createProviderDto: CreateProviderDto) {
    return this.providerService.create(createProviderDto);
  }

  @Get()
  findAll(): Promise<ReadProviderDto[]> {
    return this.providerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ReadProviderDto | null> {
    return this.providerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id')
    id: string,
    @Body() updateProviderDto: UpdateProviderDto,
  ) {
    return this.providerService.update(id, updateProviderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.providerService.remove(id);
  }
}
