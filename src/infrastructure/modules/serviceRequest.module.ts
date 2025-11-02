import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRequest } from '../../domain/entities/serviceRequest.entity';
import { Client } from '../../domain/entities/client.entity';
import { Provider } from '../../domain/entities/provider.entity';
import { ServiceProvision } from '../../domain/entities/serviceProvision.entity';
import { AppLoggerService } from '../../application/services/logger/logger.service';
import { ServiceRequestService } from '../../application/services/serviceRequest/serviceRequest.service';
import { ServiceRequestController } from '../controllers/serviceRequest.controller';
import { ServiceRequestRepositoryImpl } from '../repositories/serviceRequest.repository.impl';
import { SERVICE_REQUEST_REPOSITORY } from '../../domain/repositories/serviceRequest.repository';
import { ServiceProvisionRepositoryImpl } from '../repositories/serviceProvision.repository.impl';
import { SERVICE_PROVISION_REPOSITORY } from '../../domain/repositories/serviceProvision.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceRequest,
      Client,
      Provider,
      ServiceProvision,
    ]),
  ],
  providers: [
    AppLoggerService,
    ServiceRequestService,
    {
      provide: SERVICE_REQUEST_REPOSITORY,
      useClass: ServiceRequestRepositoryImpl,
    },
    {
      provide: SERVICE_PROVISION_REPOSITORY,
      useClass: ServiceProvisionRepositoryImpl,
    },
  ],
  controllers: [ServiceRequestController],
})
export class ServiceRequestModule {}
