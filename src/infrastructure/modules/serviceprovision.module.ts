import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProvision } from 'src/domain/entities/serviceProvision.entity';
import { Provider } from 'src/domain/entities/provider.entity';
import { ServiceRequest } from 'src/domain/entities/serviceRequest.entity';
import { ServiceProvisionService } from 'src/application/services/serviceProvision/serviceprovision.service';
import { ServiceProvisionController } from '../controllers/serviceProvision.controller';
import { AppLoggerService } from 'src/application/services/logger/logger.service';
import { SERVICE_PROVISION_REPOSITORY } from 'src/domain/repositories/serviceProvision.repository';
import { ServiceProvisionRepositoryImpl } from '../repositories/serviceProvision.repository.impl';
import { PROVIDER_REPOSITORY } from 'src/domain/repositories/provider.repository';
import { ProviderRepositoryImpl } from '../repositories/provider.repository.impl';
import { SERVICE_REQUEST_REPOSITORY } from 'src/domain/repositories/serviceRequest.repository';
import { ServiceRequestRepositoryImpl } from '../repositories/serviceRequest.repository.impl';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceProvision, Provider, ServiceRequest]),
  ],
  providers: [
    AppLoggerService,
    ServiceProvisionService,
    {
      provide: SERVICE_PROVISION_REPOSITORY,
      useClass: ServiceProvisionRepositoryImpl,
    },
    {
      provide: PROVIDER_REPOSITORY,
      useClass: ProviderRepositoryImpl,
    },
    {
      provide: SERVICE_REQUEST_REPOSITORY,
      useClass: ServiceRequestRepositoryImpl,
    },
  ],
  controllers: [ServiceProvisionController],
})
export class ServiceProvisionModule {}
