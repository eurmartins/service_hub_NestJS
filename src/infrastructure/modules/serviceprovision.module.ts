import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProvision } from 'src/domain/entities/serviceProvision.entity';
import { Provider } from 'src/domain/entities/provider.entity';
import { ServiceProvisionService } from 'src/application/services/serviceProvision/serviceprovision.service';
import { ServiceProvisionController } from '../controllers/serviceProvision.controller';
import { AppLoggerService } from 'src/application/services/logger/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceProvision, Provider])],
  providers: [AppLoggerService, ServiceProvisionService],
  controllers: [ServiceProvisionController],
})
export class ServiceProvisionModule {}
