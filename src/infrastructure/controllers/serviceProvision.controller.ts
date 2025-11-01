import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServiceProvisionService } from 'src/application/services/serviceProvision/serviceprovision.service';
import { CreateServiceProvisionDto } from 'src/application/dtos/serviceProvision/create-service-provision.dto';
import { UpdateServiceProvisionDto } from 'src/application/dtos/serviceProvision/update-service-provision.dto';
import { ReadServiceProvisionDto } from 'src/application/dtos/serviceProvision/read-service-provision.dto';

@Controller('/api/v1/service-provisions')
export class ServiceProvisionController {
  constructor(
    private readonly serviceProvisionService: ServiceProvisionService,
  ) {}

  @Post()
  create(@Body() createServiceProvisionDto: CreateServiceProvisionDto) {
    return this.serviceProvisionService.create(createServiceProvisionDto);
  }

  @Get()
  findAll(): Promise<ReadServiceProvisionDto[]> {
    return this.serviceProvisionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ReadServiceProvisionDto | null> {
    return this.serviceProvisionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceProvisionDto: UpdateServiceProvisionDto,
  ) {
    return this.serviceProvisionService.update(id, updateServiceProvisionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.serviceProvisionService.remove(id);
  }
}
