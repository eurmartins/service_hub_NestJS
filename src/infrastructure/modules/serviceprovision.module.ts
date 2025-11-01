import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProvision } from 'src/domain/entities/serviceProvision.entity';
import { Provider } from 'src/domain/entities/provider.entity';
import { ServiceProvisionService } from 'src/application/services/serviceProvision/serviceprovision.service';
import { ServiceProvisionController } from '../controllers/serviceProvision.controller';
import { AppLoggerService } from 'src/application/services/logger/logger.service';
import { SERVICE_PROVISION_REPOSITORY } from 'src/domain/repositories/serviceProvision.repository';
import { ServiceProvisionRepositoryImpl } from '../repositories/serviceProvision.repository.impl';
import { PROVIDER_REPOSITORY } from 'src/domain/repositories/provider.repository';
import { ProviderRepositoryImpl } from '../repositories/provider.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceProvision, Provider])],
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
  ],
  controllers: [ServiceProvisionController],
})
export class ServiceProvisionModule {}
