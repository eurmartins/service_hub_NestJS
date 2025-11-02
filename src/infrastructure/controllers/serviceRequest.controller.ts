import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ServiceRequestService } from '../../application/services/serviceRequest/serviceRequest.service';
import { CreateServiceRequestDto } from '../../application/dtos/serviceRequest/create-service-request.dto';
import { ReadServiceRequestDto } from '../../application/dtos/serviceRequest/read-service-request.dto';
import { UpdateServiceRequestStatusDto } from '../../application/dtos/serviceRequest/update-service-request-status.dto';
import { ServiceRequest } from '../../domain/entities/serviceRequest.entity';

@Controller('/api/v1/service-requests')
export class ServiceRequestController {
  constructor(private readonly serviceRequestService: ServiceRequestService) {}

  @Post()
  async create(
    @Body() createServiceRequestDto: CreateServiceRequestDto,
  ): Promise<ServiceRequest> {
    return this.serviceRequestService.create(createServiceRequestDto);
  }

  @Get()
  async findAll(): Promise<ReadServiceRequestDto[]> {
    return this.serviceRequestService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ReadServiceRequestDto | null> {
    return this.serviceRequestService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.serviceRequestService.remove(id);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateServiceRequestStatusDto,
  ): Promise<ServiceRequest> {
    return this.serviceRequestService.updateStatus(id, updateStatusDto.status);
  }
}
